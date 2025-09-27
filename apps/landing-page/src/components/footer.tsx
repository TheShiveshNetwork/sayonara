
export function Footer() {
    return (
        <footer className="w-full border-t border-border bg-background/80 backdrop-blur-md">
            <div className="container mx-auto md:max-w-6xl py-6 px-4 md:px-0 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
                <p>© 2024 Sayonara. All rights reserved.</p>
                <div className="flex space-x-4 mt-4 md:mt-0">
                    <a href="/privacy" className="hover:underline">Privacy Policy</a>
                    <a href="/terms" className="hover:underline">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
}