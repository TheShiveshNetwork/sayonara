import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Zap } from 'lucide-react';
import USB_IMAGE from "@/assets/usb_mockup.png"
import Image from 'next/image';

export default function ProductCard() {
    return (
        <div className="relative min-h-screen py-10">
            <div
                className="absolute inset-0 -z-[1]"
                style={{
                    background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99, 102, 241, 0.25), transparent 70%), #000000",
                }}
            />
            <div className="mx-auto pt-10 px-4 md:px-0 max-w-6xl relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">
                        Our Products
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        You can choose to buy our products
                    </p>
                </div>

                {/* Liquid Glass Product Card */}
                <Card className="w-full relative overflow-hidden border-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl shadow-2xl">
                    {/* Glass reflection effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent"></div>
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                    <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>

                    <CardContent className="p-0 relative z-10">
                        <div className="grid md:grid-cols-2 gap-0">
                            {/* Product Image Section */}
                            <div className="relative flex items-center justify-center bg-gradient-to-br from-slate-800/50 to-slate-900/50">
                                <Image
                                    src={USB_IMAGE}
                                    alt="Sayonara USB Drive"
                                    className="h-full w-full object-contain"
                                    width={400}
                                    height={400}
                                />
                            </div>

                            {/* Product Details Section */}
                            <div className="flex flex-col justify-center p-8 md:p-12 space-y-6">
                                {/* Product Name */}
                                <div className="space-y-2">
                                    <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                                        Sayonara USB Drive
                                    </h3>
                                </div>

                                {/* Product Description */}
                                <p className="text-slate-300 text-lg leading-relaxed">
                                    Pre-loaded with the Sayonara wipe ISO and completely configured. Simply plug in and boot to start the secure wipe process immediately. No setup required.
                                </p>

                                {/* Features */}
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 text-xs font-medium bg-purple-500/20 text-purple-200 rounded-full border border-purple-500/30">
                                        USB 1.0
                                    </span>
                                    <span className="px-3 py-1 text-xs font-medium bg-cyan-500/20 text-cyan-200 rounded-full border border-cyan-500/30">
                                        256GB
                                    </span>
                                </div>

                                {/* Price */}
                                <div className="flex items-baseline space-x-2">
                                    Starting at
                                    <span className="text-3xl font-bold text-white ml-2">₹750</span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                    <Button className='flex-1'>
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <ShoppingCart className="w-5 h-5 mr-2" />
                                        Add to Cart
                                    </Button>

                                    <Button className='flex-1' variant={'outline'}>
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <Zap className="w-5 h-5 mr-2" />
                                        Buy Now
                                    </Button>
                                </div>

                                {/* Trust indicators */}
                                <div className="flex items-center justify-between pt-6 border-t border-white/10">
                                    <div className="flex items-center space-x-2 text-slate-400">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        <span className="text-sm">In Stock</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-slate-400">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                        <span className="text-sm">Custom Wipes</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-slate-400">
                                        <span className="text-sm">Free Shipping</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>

                    {/* Additional glass effects */}
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-cyan-500/10 to-transparent rounded-full blur-2xl"></div>
                    <div className="absolute top-1/4 right-0 w-1 h-32 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
                </Card>
            </div>
        </div>
    );
}