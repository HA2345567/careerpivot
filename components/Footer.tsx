import React from 'react';
import { APP_NAME } from '../constants';

const Footer = () => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
            <div>
                <h3 className="text-xl font-bold text-white mb-4">{APP_NAME}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
                    The career operating system for professionals ready to make a calculated, safe, and successful pivot.
                </p>
            </div>
            
            <div>
                <h4 className="font-semibold text-zinc-200 mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-zinc-500">
                    <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Success Stories</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Calculator</a></li>
                </ul>
            </div>

            <div>
                <h4 className="font-semibold text-zinc-200 mb-4">Resources</h4>
                <ul className="space-y-2 text-sm text-zinc-500">
                    <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Career Change Guide</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Community</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                </ul>
            </div>

            <div>
                <h4 className="font-semibold text-zinc-200 mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-zinc-500">
                    <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
                </ul>
            </div>
        </div>
        
        <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-zinc-600">
                © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
            </p>
            <div className="flex gap-4">
                 {/* Social placeholders */}
                <div className="h-5 w-5 bg-zinc-800 rounded-full hover:bg-primary transition-colors cursor-pointer"></div>
                <div className="h-5 w-5 bg-zinc-800 rounded-full hover:bg-primary transition-colors cursor-pointer"></div>
                <div className="h-5 w-5 bg-zinc-800 rounded-full hover:bg-primary transition-colors cursor-pointer"></div>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
