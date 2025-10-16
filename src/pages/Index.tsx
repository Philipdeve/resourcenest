import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Video, BookmarkIcon, Share2 } from "lucide-react";
import Navbar from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gradient-hero)] -z-10" />
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Your Gateway to <span className="gradient-text">STEM Excellence</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Access curated educational resources in Science, Technology, Engineering, and Mathematics. 
            Learn, bookmark, and share knowledge with ease.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" asChild>
              <Link to="/auth">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/resources">Browse Resources</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Everything You Need to Learn</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-[var(--shadow-card)] card-hover">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">PDF Resources</h3>
              <p className="text-muted-foreground">
                Access comprehensive study materials, textbooks, and reference guides in PDF format.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-[var(--shadow-card)] card-hover">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Video className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Video Tutorials</h3>
              <p className="text-muted-foreground">
                Learn from expert-created video content covering various STEM topics and concepts.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-[var(--shadow-card)] card-hover">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BookmarkIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Bookmark & Organize</h3>
              <p className="text-muted-foreground">
                Save your favorite resources and organize them for easy access anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Explore by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Mathematics", "Science", "Technology", "Engineering"].map((category) => (
              <Button
                key={category}
                variant="outline"
                size="lg"
                className="h-24 text-lg hover:bg-primary hover:text-primary-foreground"
                asChild
              >
                <Link to="/resources">{category}</Link>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students accessing quality STEM education resources.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/auth">Create Your Account</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2025 Student Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
