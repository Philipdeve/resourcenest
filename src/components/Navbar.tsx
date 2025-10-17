import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, BookmarkIcon, LogOut, User } from "lucide-react";
import {FaBars, FaTimes } from "react-icons/fa";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState, useRef } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { toast } from "sonner";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
    const menuRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);



  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo / Title */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold tracking-tight text-gray-900 hover:opacity-90 transition-opacity"
        >
          <BookOpen className="h-6 w-6 text-[#FF6B6B]" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B6B] to-[#6C63FF]">
            ResourceNest
          </span>
        </Link>

        {/* Hamburger Menu */}
        <div className="flex items-center gap-4 md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-700 hover:text-[#6C63FF]"
          >
            {isMobileMenuOpen ? (
              <FaTimes className="h-6 w-6" />
            ) : (
              <FaBars className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <NavButton to="/resources" icon={<BookOpen className="h-4 w-4" />} label="Resources" />
              <NavButton to="/bookmarks" icon={<BookmarkIcon className="h-4 w-4" />} label="Bookmarks" />
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-700 hover:text-[#6C63FF] hover:bg-[#6C63FF]/10 "
                asChild
              >
                <Link to="/profile">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-gray-700 hover:text-[#6C63FF] hover:bg-[#6C63FF]/10 "
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Button
              asChild
              className="bg-[#FF6B6B] hover:bg-[#FF5252] text-white rounded-xl font-semibold shadow-sm"
            >
              <Link to="/auth">Get Started</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Links */}
      <div
        ref={menuRef} // Attach ref to the menu div
        className={`mobile-menu md:hidden ${
          isMobileMenuOpen ? "block" : "hidden"
        } absolute top-16 left-0 w-full bg-white shadow-lg`}
      >
        <div className="flex flex-col items-center py-4">
          {user ? (
            <>
              <NavButton to="/resources" icon={<BookOpen className="h-4 w-4" />} label="Resources" />
              <NavButton to="/bookmarks" icon={<BookmarkIcon className="h-4 w-4" />} label="Bookmarks" />
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-700 hover:text-[#6C63FF] hover:bg-[#6C63FF]/10 "
                asChild
              >
                <Link to="/profile">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-gray-700 hover:text-[#6C63FF] hover:bg-[#6C63FF]/10 "
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Button
              asChild
              className="bg-[#FF6B6B] hover:bg-[#FF5252] text-white rounded-xl font-semibold shadow-sm"
            >
              <Link to="/auth">Get Started</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

// Reusable Navigation Button Component
const NavButton = ({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) => (
  <Button
    variant="ghost"
    asChild
    className="text-gray-700 hover:text-[#6C63FF] hover:bg-[#6C63FF]/10 transition-colors rounded-lg"
  >
    <Link to={to} className="flex items-center gap-2">
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  </Button>
);

export default Navbar;
