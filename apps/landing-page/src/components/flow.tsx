import SayonaraPixelCards from './ui/pixel-card';

const SayonaraFeatures = () => {
    return (
        <div className="relative">
            {/* Radial Gradient Background */}
            <div
                className="absolute inset-0 z-0 opacity-30"
                style={{
                    background: "radial-gradient(125% 125% at 50% 10%, transparent 40%, #6366f1 100%)",
                }}
            />
            <div className="mx-auto py-10 px-4 md:px-0 max-w-6xl relative">
                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold">
                        Our Features
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Advanced secure data erasure solution
                    </p>
                </div>
                <SayonaraPixelCards />
            </div>
        </div>
    );
};

export default SayonaraFeatures;