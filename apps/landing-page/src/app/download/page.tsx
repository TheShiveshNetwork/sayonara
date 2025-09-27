import { Button } from "@/components/ui/button";
import { Disc, Download } from "lucide-react";
import Link from "next/link";

export default function DownloadPage() {
    return (
        <div className="relative">
            {/* Radial Gradient Background from Top */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: "radial-gradient(125% 125% at 50% 10%, transparent 40%, #7c3aed 100%)",
                }}
            />
            <div className="mx-auto min-h-screen px-4 md:px-0 max-w-6xl relative flex flex-col items-center justify-center">
                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Download Sayonara
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                        Download the Sayonara wipe software for secure data erasure.
                    </p>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
                    <Button asChild variant={"default"}>
                        <Link
                            href="/download-app"
                        >
                            <Download className="h-5 w-5" />
                            Download App
                        </Link>
                    </Button>
                    <Button asChild variant={"outline"}>
                        <Link
                            href="/download-iso"
                        >
                            <Disc className="h-5 w-5" />
                            Download ISO
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}