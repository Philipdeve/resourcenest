import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Bookmark, Share2, MessageSquare, Search } from "lucide-react";
import Navbar from "@/components/Navbar";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Map search keywords to unique disciplines
  const disciplineMap: Record<string, string> = {
    business: "business",
    "business & management": "business",
    engineering: "engineering",
    arts: "arts & humanities",
    humanities: "arts & humanities",
    "social sciences": "social science",
    social: "social science",
    medicine: "health and medicine",
    health: "health and medicine",
    "computer science": "computer science",
    computer: "computer science",
    technology: "computer science", // Example: technology → CS
    education: "education",
    law: "law and governance",
    governance: "law and governance",
  };

  const handleSearch = () => {
    const trimmed = searchTerm.trim().toLowerCase();

    if (!trimmed) {
      navigate("/resources");
      return;
    }

    // Check if search matches a discipline
    const matchedDiscipline = Object.keys(disciplineMap).find((key) =>
      trimmed.includes(key)
    );

    if (matchedDiscipline) {
      navigate(
        `/resources?discipline=${encodeURIComponent(
          disciplineMap[matchedDiscipline]
        )}`
      );
    } else {
      navigate(`/resources?search=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Navigate Your Academic Journey with{" "}
            <span className="text-[#FF6B6B]">Ease</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10">
            A supportive academic hub where students and educators across disciplines
            access curated university and postgraduate resources — from research papers
            to study notes and learning guides.
          </p>

          {/* Search Bar */}
          <div className="relative flex justify-center items-center w-full max-w-lg mx-auto mb-10">
            <Search className="absolute left-4 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by topic, degree program, or resource type..."
              className="pl-10 pr-20 border border-gray-300 focus:ring-2 focus:ring-[#6C63FF] focus:border-[#6C63FF] rounded-xl"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button
              onClick={handleSearch}
              className="ml-2 bg-[#FF6B6B] hover:bg-[#FF5252] text-white rounded-xl flex items-center gap-2"
            >
              <Search size={18} /> Search
            </Button>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-[#FF6B6B] hover:bg-[#FF5252] text-white rounded-xl"
              asChild
            >
              <Link to="/auth">Join ResourceNest</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-[#6C63FF] text-[#6C63FF] hover:bg-[#6C63FF] hover:text-white rounded-xl"
              asChild
            >
              <Link to="/resources">Browse Resources</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Learn, Contribute, and Connect
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <FeatureCard
              icon={<FileText className="h-6 w-6 text-[#FF6B6B]" />}
              title="Find Quality Resources"
              desc="Access curated PDFs, lecture notes, and journals across all university and postgraduate fields."
            />
            <FeatureCard
              icon={<Bookmark className="h-6 w-6 text-[#6C63FF]" />}
              title="Save & Organize"
              desc="Bookmark and categorize your favorite materials for easy revisiting."
            />
            <FeatureCard
              icon={<Share2 className="h-6 w-6 text-[#FF6B6B]" />}
              title="Share Knowledge"
              desc="Upload and share your own research, notes, or guides to empower others."
            />
            <FeatureCard
              icon={<MessageSquare className="h-6 w-6 text-[#6C63FF]" />}
              title="Engage in Discussions"
              desc="Join academic threads, ask questions, and share insights with fellow learners."
            />
          </div>
        </div>
      </section>

      {/* ===== DISCIPLINE FILTERS ===== */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Explore by Discipline
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Business & Management", key: "business" },
              { name: "Engineering", key: "engineering" },
              { name: "Arts & Humanities", key: "arts & humanities" },
              { name: "Social Sciences", key: "social science" },
              { name: "Medicine & Health", key: "health and medicine" },
              { name: "Computer Science", key: "computer science" },
              { name: "Education", key: "education" },
              { name: "Law & Governance", key: "law and governance" },
            ].map((discipline) => (
              <Button
                key={discipline.key}
                variant="outline"
                className="h-20 rounded-xl text-lg hover:bg-[#FF6B6B] hover:text-white border-gray-300"
                asChild
              >
                <Link to={`/resources?discipline=${encodeURIComponent(discipline.key)}`}>
                  {discipline.name}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COMMUNITY CALL ===== */}
      <section className="py-20 px-4 bg-gradient-to-r from-[#FF6B6B] to-[#6C63FF] text-white text-center">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-4">Empower Your Learning Community</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            From first-year students to postgraduate researchers — collaborate, share,
            and grow together through the exchange of knowledge.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-[#FF6B6B] hover:bg-gray-100 rounded-xl font-semibold"
            asChild
          >
            <Link to="/auth">Get Started</Link>
          </Button>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t py-8 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} ResourceNest — Learn. Share. Grow.</p>
      </footer>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => (
  <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
    <div className="w-12 h-12 bg-[#FF6B6B]/10 rounded-lg flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{desc}</p>
  </div>
);

export default Index;
