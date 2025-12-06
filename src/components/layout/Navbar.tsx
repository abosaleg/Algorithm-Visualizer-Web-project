import { motion } from 'framer-motion';
import { Sun, Moon, Menu, Github, Book } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onMenuToggle: () => void;
}

export function Navbar({ onMenuToggle }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 h-16 px-4 md:px-6"
    >
      <div className="glass-card h-full flex items-center justify-between px-4 md:px-6">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuToggle}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <Link to="/" className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="font-display font-bold text-primary-foreground text-lg">A</span>
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="font-display font-bold text-xl tracking-wider">
                <span className="text-gradient">AlgoVision</span>
              </h1>
              <p className="text-[10px] text-muted-foreground -mt-1 tracking-widest uppercase">
                Algorithm Visualizer
              </p>
            </div>
          </Link>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:flex"
            asChild
          >
            <Link to="/documentation">
              <Book className="h-5 w-5" />
            </Link>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:flex"
            onClick={() => window.open('https://github.com', '_blank')}
          >
            <Github className="h-5 w-5" />
          </Button>

          <motion.div whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="relative"
            >
              <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 0 : 180, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-neon-orange" />
                ) : (
                  <Moon className="h-5 w-5 text-neon-purple" />
                )}
              </motion.div>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}
