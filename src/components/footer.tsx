import { cw } from "@/util/tailwind";

function Footer({ className }: { className?: string }) {
    return (<footer className={cw("font-sans text-center p-2 bg-black text-white flex justify-center gap-4", className)}>
        <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} iieo. All rights reserved.
        </p>
        <p className="text-xs">
            <a href="/impressum" className="text-gray-400 hover:underline">
                Impressum
            </a>
        </p>
        <p className="text-xs">
            <a href="/datenschutz" className="text-gray-400 hover:underline">
                Datenschutz
            </a>
        </p>
    </footer>);
}

export default Footer;