'use client';

import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { socialLinks } from '@/data/site';

export function WhatsAppButton() {
  return (
    <motion.a
      href={socialLinks.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow"
    >
      <MessageCircle className="w-7 h-7" />
    </motion.a>
  );
}
