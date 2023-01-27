import {writable} from "svelte/store";
import Nostr from "$lib/Nostr"
import { persisted } from 'svelte-local-storage-store'

export const introDismissed = persisted('introDismissed', false);
export const nostrPool = writable(new Nostr())
export const nostrNotes = writable({responses: {}})
export const posts = writable([])
export const profiles = writable({})
export const relayEvents = writable({})