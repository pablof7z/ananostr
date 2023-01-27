import { nostrNotes, posts, profiles, relayEvents } from "$lib/store";
import "websocket-polyfill"
import {RelayPool, Relay} from 'nostr';
import { getEventHash } from 'nostr-tools/index'
import { browser } from "$app/environment";
import { v4 as uuidv4 } from 'uuid';

const connectionStatus = {
    connecting: 'connecting',
    connected: 'connected',
    disconnected: 'disconnected',
    error: 'error',
}

export default class Nostr {
	constructor() {
        this.pool = new RelayPool([]);
        this.relays = []
        this.relayStatus = connectionStatus.disconnected;
        this.subscriptionQueue = [];
	}

    async add(relayUrl) {
        const relay = new Relay(relayUrl);
        this.pool.add(relay);
        this.pool.on('open', (relay) => {
            // this.relayStatus = connectionStatus.connected;
            this.relays.push(relay);
            relayEvents.update((relays) => {
                relays[relay.url] = 0;
                return relays;
            })
            console.log(`Connected to relay ${relay.url}, will request ${this.subscriptionQueue.length} subscriptions`);
            this.subscriptionQueue.forEach((queries) => {
                // console.log('subscribe', queries);
                relay.subscribe(uuidv4(), queries);
            })
        })

        this.pool.on('event', async (relay, subId, e) => await this.processEvent(e, relay))
    }

    async subscribe(queries) {
        if (!this.subscriptionQueue.find((q) => JSON.stringify(q) === JSON.stringify(queries))) {
            console.log('queueing query', JSON.stringify(queries));
            this.subscriptionQueue.push(queries);
        }

        this.pool.subscribe(uuidv4(), queries)
    }
    
    async processEvent(event, relay) {
        relayEvents.update(relays => {
            relays[relay.url] = (relays[relay.url] || 0) + 1;
            return relays;
        })
        
        try { event.content = JSON.parse(event.content); } catch (e) { /* empty */ }
        
        if (event.kind === 2) {
            console.log(`got post ${event.id}`);
        } else if (event.kind === 11120) {
            posts.update((posts) => {
                if (!posts.find((p) => p.id === event.id)) {
                    posts.unshift(event)
                    this.reqProfile(event.pubkey);
                }
                // console.log(`there are posts: ${posts.length}`);
                return posts;
            })
        } else if (event.kind === 0) {
            console.log(`got profile ${event.pubkey}`);
            profiles.update((profiles) => {
                profiles[event.pubkey] = {
                    ...profiles[event.pubkey],
                    ...event.content
                };
                console.log(`there are profiles: ${Object.values(profiles).length}`);
                return profiles;
            })
        }

        nostrNotes.update((notes) => {
            notes[event.id] = event;
            // console.log(`there are notes: ${Object.values(notes).length}`);
            return notes;
        });

        // annotate events this event references
        for (let tag of event.tags) {
            const [ type, eventId ] = tag;
            if (type === 'e') {
                nostrNotes.update((notes) => {
                    notes.responses[eventId] = notes.responses[eventId] || [];

                    // don't add duplicate responses
                    if (!notes.responses[eventId].includes(event.id)) {
                        notes.responses[eventId].push(event.id);
                    }

                    // sort responses by timestamp
                    notes.responses[eventId].sort((a, b) => {
                        return notes[a].created_at - notes[b].created_at;
                    }).reverse();

                    return notes;
                });
            }
        }

        // subscribe to responses to this event
        this.subscribe({ '#e': [event.id] })
    }

    reqEvent(eventId) {
        console.log(`requesting event ${eventId}`);
        if (!posts[eventId]) {
            this.subscribe( {ids: [eventId]}, { '#e': [eventId] })
        }
    }

    reqProfile(pubkey) {
        if (!profiles[pubkey]) {
            // populate profile with a placeholder
            // profiles.update((profiles) => {
            //     profiles[pubkey] = this.emptyProfile(pubkey)
            //     return profiles;
            // });
            this.subscribe({kinds: [0], authors: [pubkey]})
        }
    }

    emptyProfile(pubkey) {
        return {
            pubkey: pubkey,
            display_name: pubkey,
            picture: `https://robohash.org/${pubkey}.png?set=set4`
        }
    }

    async fetchOwnProfile() {
        try {
            const pubkey = await window.nostr.getPublicKey();
            this.reqProfile(pubkey);
            this.subscribe({kinds: [2], authors: [pubkey]})
            return pubkey;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async signAndPublishEvent(event) {
        console.log('signing and publishing event', event);
        event.id = getEventHash(event);
        const signedEvent = await window.nostr.signEvent(event)

        console.log(this.relays);
        await this.pool.send(["EVENT", signedEvent], this.relays);
        // let pub = this.relay.publish(signedEvent);
        // pub.on('ok', () => {
            // reset form
            // document.getElementById('post-form').reset();
        //     console.log(`ok on ${this.relay.url}`)
        // })
        // pub.on('seen', () => {
        //     console.log(`we saw the event on ${this.relay.url}`)
        // })
        // pub.on('failed', reason => {
        //     console.log(`failed to publish to ${this.relay.url}: ${reason}`)
        // })
        // console.log(pub);

        return { publishEvent: signedEvent };
    }
}
