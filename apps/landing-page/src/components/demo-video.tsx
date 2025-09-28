
export function DemoVideo() {
    return (
        <div className="relative">
            {/* Radial Gradient Background from Bottom */}
            <div
                className="absolute inset-0 z-0 opacity-30"
                style={{
                    background: "radial-gradient(125% 125% at 50% 90%, transparent 40%, #6366f1 100%)",
                }}
            />
            <div
                id="demo"
                className="mx-auto py-10 px-4 md:px-0 max-w-6xl relative"
            >
                {/* Card wrapper */}
                <div className="relative rounded-2xl border md:rounded-3xl overflow-hidden shadow-lg">
                    <div className="relative rounded-xl overflow-hidden">
                        {/* <iframe
                            className="absolute inset-0 w-full h-full rounded-xl"
                            src="https://www.youtube.com/embed/YRddOEtlnEk?si=niZf9YBQLYus9GMN"
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        /> */}
                        <video
                            src={"/demo.mp4"}
                            className="w-full h-full"
                            autoPlay
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
