import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { Dashboard } from "@/components/Dashboard";
import { useToast } from "@/hooks/use-toast";

// Mock user data - in real app, this would come from Google OAuth
const mockUser = {
  name: "John Doe",
  email: "john.doe@gmail.com",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  quota: {
    used: 8.5 * 1024 * 1024 * 1024, // 8.5 GB
    total: 15 * 1024 * 1024 * 1024, // 15 GB
  },
};

const Index = () => {
  const [user, setUser] = useState<typeof mockUser | null>(null);
  const { toast } = useToast();

  const handleGoogleLogin = () => {
    // In real app, this would redirect to Google OAuth
    // For demo, we'll simulate a successful login
    toast({
      title: "Demo Mode",
      description: "This is a demo. In the real app, Google OAuth would be implemented here.",
    });
    
    // Simulate login after a short delay
    setTimeout(() => {
      setUser(mockUser);
      toast({
        title: "Welcome!",
        description: "Successfully signed in with Google",
      });
    }, 1000);
  };

  const handleLogout = () => {
    setUser(null);
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} onLogout={handleLogout} />
      
      {!user ? (
        <HeroSection onGoogleLogin={handleGoogleLogin} />
      ) : (
        <Dashboard user={user} />
      )}
    </div>
  );
};

export default Index;
