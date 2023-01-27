export function formatSatoshis(sats, {tryThousands} = {}) {
    if (sats >= 1000000) {
        if (sats % 100000000 === 0) {
            return (sats / 100000000) + " BTC";
        }
        return (sats / 100000000).toFixed(2) + " BTC";
    }

    if (tryThousands && sats >= 1000) {
        sats = sats/1000;
    }
    
    let v = sats.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    // if v has more than two spaces, turn the first one into a comma
    if (v.indexOf(" ") > -1) {
        v = v.replace(" ", ",");
    }

    return `${v}${tryThousands&&'k'} sats`;
}