import Link from "next/link";

function GameOverview() {
    return (<div>
        <Link href="/imposter">Imposter</Link>
        <Link href="/drink">drinking game</Link>
    </div>);
}

export default GameOverview;