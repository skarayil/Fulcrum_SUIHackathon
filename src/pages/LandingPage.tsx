import { CheckCircledIcon, Cross2Icon, InfoCircledIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID, MODULE_NAME, CONTESTANT_REGISTRY_ID } from "../config/constants";
// Emojilerin yerine kullanılacak modern ikonlar
import { User, Code, Target, Shield, Lightbulb, Star, Github } from "lucide-react";

// Project Info Popup
const ProjectInfoPopup = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-gradient-to-br from-gray-900 to-black border border-blue-500/30 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <InfoCircledIcon className="w-8 h-8 text-blue-400" />
            <h3 className="text-2xl font-bold text-white">About FULCRUM</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <Cross2Icon className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6 text-gray-300">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-blue-400" />
                <h4 className="text-lg font-bold text-blue-400">Our Mission</h4>
            </div>
            <p className="leading-relaxed">
              FULCRUM is a blockchain-based platform that ensures fair, transparent, and secure distribution of hackathon and competition prizes. Running on the SUI blockchain, our system protects team members and prevents unfair practices.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-blue-400" />
                <h4 className="text-lg font-bold text-blue-400">Security</h4>
            </div>
            <p className="leading-relaxed">
              With a fully decentralized architecture, no central authority can control the system. All transactions are recorded transparently on the blockchain and are auditable by anyone.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-5 h-5 text-blue-400" />
                <h4 className="text-lg font-bold text-blue-400">How It Works</h4>
            </div>
            <p className="leading-relaxed">
              The sponsor creates the prize pool and sets jury members and candidates. Voting is initiated and jury members cast their votes. Winners are determined based on results and prizes are distributed automatically.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-blue-400" />
                <h4 className="text-lg font-bold text-blue-400">Why FULCRUM?</h4>
            </div>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircledIcon className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span>The team lead cannot take the prize alone</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircledIcon className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span>All members receive equal shares</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircledIcon className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Unfair members can be removed democratically</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircledIcon className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span>All transactions are transparent on-chain</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-sm text-blue-300">
              <strong>Open Source:</strong> FULCRUM is fully open source. Review the code, contribute, and be part of our community.
            </p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-6 bg-gradient-to-r from-blue-500 to-cyan-600 px-6 py-3 rounded-lg font-bold hover:shadow-md hover:shadow-blue-500/30 transition"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

// Membership Form
const MembershipForm = () => {
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "contestant",
    organization: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!account) {
      alert("Please connect your wallet first!");
      return;
    }

    setIsSubmitting(true);

    try {
      const tx = new Transaction();
      
      if (formData.role === "sponsor") {
        tx.moveCall({
          target: `${PACKAGE_ID}::${MODULE_NAME}::create_sponsor`,
        });
      } else if (formData.role === "contestant") {
        tx.moveCall({
          target: `${PACKAGE_ID}::${MODULE_NAME}::create_contestant`,
          arguments: [tx.object(CONTESTANT_REGISTRY_ID)],
        });
      }

      signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: (result) => {
            console.log("Registration successful:", result);
            alert(`Congratulations! You have registered as a ${formData.role === "sponsor" ? "Sponsor" : formData.role === "contestant" ? "Contestant" : "Developer"}. You can refresh the page.`);
            // Reset form
            setFormData({
              name: "",
              email: "",
              role: "contestant",
              organization: "",
            });
          },
          onError: (error) => {
            console.error("Registration failed:", error);
            alert("Registration failed: " + error.message);
          },
        }
      );
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center py-20 px-4 bg-gradient-to-b from-black to-blue-900/20 snap-start">
      <div className="max-w-2xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Join the Community
          </h2>
          <p className="text-gray-400 text-lg">
            Become part of the FULCRUM ecosystem and help shape the future of transparent prize distribution
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-black/40 backdrop-blur border border-blue-500/20 rounded-2xl p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-black/50 border border-blue-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-black/50 border border-blue-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Your Role *
            </label>
            <select
              required
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full bg-black/50 border border-blue-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
            >
              <option value="contestant">Contestant</option>
              <option value="sponsor">Sponsor</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Organization (Optional)
            </label>
            <input
              type="text"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              className="w-full bg-black/50 border border-blue-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
              placeholder="Company or university name"
            />
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-sm text-gray-300">
              <InfoCircledIcon className="inline w-4 h-4 mr-2 text-blue-400" />
              {!account 
                ? "Please connect your wallet (top right) to register."
                : "When you submit, a capability NFT for your selected role will be minted to your wallet."
              }
            </p>
          </div>

          <button
            type="submit"
            disabled={!account || isSubmitting}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 px-6 py-4 rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-blue-500/30 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {!account ? "Connect Wallet" : isSubmitting ? "Processing..." : "Register"}
          </button>
        </form>
      </div>
    </section>
  );
};

// Hero Section
const Hero = () => {
  const [showProjectInfo, setShowProjectInfo] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 snap-start">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-cyan-900/20"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto text-center w-full py-8">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2 mb-8 animate-pulse">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          <span className="text-sm text-blue-300">Live on SUI Testnet</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-3 leading-tight px-4">
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            FULCRUM
          </span>
          <br />
          <span className="text-white">Balance Through Blockchain</span>
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-5 max-w-3xl mx-auto leading-relaxed px-4">
          Distribute hackathon and competition prizes in a transparent, democratic, and secure way. 
          Protects team members and prevents unfair practices.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <button 
            onClick={() => setShowProjectInfo(true)}
            className="bg-gradient-to-r from-blue-500 to-cyan-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-blue-500/30 transition transform hover:scale-105"
          >
            Explore
          </button>
          <a 
            href="#features" 
            className="border border-blue-500/30 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-500/10 transition"
          >
            How It Works?
          </a>
        </div>

        <ProjectInfoPopup isOpen={showProjectInfo} onClose={() => setShowProjectInfo(false)} />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto px-4">
          <div className="card-hover bg-black/40 backdrop-blur p-6 rounded-xl border border-blue-500/20 cursor-pointer">
            <div className="text-4xl font-bold text-blue-400 mb-2">100%</div>
            <div className="text-sm text-gray-400">Transparency</div>
          </div>
          <div className="card-hover bg-black/40 backdrop-blur p-6 rounded-xl border border-blue-500/20 cursor-pointer">
            <div className="text-4xl font-bold text-cyan-400 mb-2">0%</div>
            <div className="text-sm text-gray-400">Platform Fee</div>
          </div>
          <div className="card-hover bg-black/40 backdrop-blur p-6 rounded-xl border border-blue-500/20 cursor-pointer">
            <div className="text-4xl font-bold text-blue-400 mb-2">&lt;1s</div>
            <div className="text-sm text-gray-400">Instant Transaction</div>
          </div>
          <div className="card-hover bg-black/40 backdrop-blur p-6 rounded-xl border border-blue-500/20 cursor-pointer">
            <div className="text-4xl font-bold text-cyan-400 mb-2">100%</div>
            <div className="text-sm text-gray-400">Secure</div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Features Section
const Features = () => {
  const features = [
    {
      title: "Blockchain Security",
      description: "Fully decentralized on SUI blockchain. No one can manipulate the system."
    },
    {
      title: "Democratic Voting",
      description: "Remove unfair members with majority vote from team members."
    },
    {
      title: "Instant Distribution",
      description: "Prizes are distributed automatically and instantly. No intermediaries needed."
    },
    {
      title: "Transparent System",
      description: "All transactions are on blockchain. Everyone can audit."
    }
  ];

  return (
    <section id="features" className="min-h-screen flex items-center justify-center py-12 md:py-20 px-4 snap-start">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto px-4">
            Fair and secure prize system powered by Web3 technology
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 px-4">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="card-hover bg-black/40 backdrop-blur border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/50 transition group cursor-pointer"
            >
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// How It Works
const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      title: "Create Pool",
      description: "Sponsor creates the prize pool with SUI tokens and sets jury members and candidates."
    },
    {
      number: "2",
      title: "Initialize Votes",
      description: "After pool creation, votes are initialized to start the voting process."
    },
    {
      number: "3",
      title: "Jury Voting",
      description: "Jury members vote for their preferred candidates from the candidate list."
    },
    {
      number: "4",
      title: "Distribute Prize",
      description: "Organizer closes voting and winners are determined based on vote counts."
    },
    {
      number: "5",
      title: "Claim Prize",
      description: "Winners claim their prizes after the release time has passed."
    }
  ];

  return (
    <section className="min-h-screen flex items-center justify-center py-12 md:py-20 px-4 bg-gradient-to-b from-black to-blue-900/10 snap-start">
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-8 md:mb-16 px-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 text-white">
            How It Works?
          </h2>
          <p className="text-gray-400 text-base md:text-lg">
            Fair prize distribution in 5 simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 px-4">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="card-hover bg-black/40 backdrop-blur border border-blue-500/20 rounded-xl p-5 hover:border-blue-500/50 transition h-full cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-xl font-bold mb-3">
                  {step.number}
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 transform translate-x-0 z-0"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// About Section
const AboutSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center py-12 md:py-20 px-4 snap-start">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center px-4">
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              What is FULCRUM?
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              FULCRUM is a blockchain-based platform that ensures fair and transparent distribution 
              of hackathon and competition prizes. Our system, running on SUI blockchain, 
              protects team members and prevents unfair practices.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircledIcon className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-white mb-1">Fully Decentralized</h4>
                  <p className="text-gray-400">No central authority controls the system.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircledIcon className="w-6 h-6 text-cyan-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-white mb-1">Low Cost</h4>
                  <p className="text-gray-400">Benefit from SUI blockchain's low transaction fees.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircledIcon className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-white mb-1">Open Source</h4>
                  <p className="text-gray-400">All code is open source and open to community review.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card-hover bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-8 cursor-pointer">
            <h3 className="text-2xl font-bold mb-6 text-white">Why FULCRUM?</h3>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start gap-3">
                <CheckCircledIcon className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                <span>Team leader cannot take the prize alone</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircledIcon className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                <span>All members receive equal share</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircledIcon className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                <span>Unfair members can be removed democratically</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircledIcon className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                <span>All transactions are transparent on blockchain</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

// Team Section
const Team = () => {
  const team = [
    {
      name: "Muhammed Şengül",
      role: "Smart Contract & Backend",
      avatar: <User className="w-16 h-16 text-blue-400 mb-4" />,
      description: "SUI blockchain development",
      github: "https://github.com/msngl0234"
    },
    {
      name: "Sude Naz Karayıldırım",
      role: "Frontend & UI/UX",
      avatar: <User className="w-16 h-16 text-blue-400 mb-4" />,
      description: "User interface design",
      github: "https://github.com/skarayil"
    }
  ];

  return (
    <section className="min-h-screen flex items-center justify-center py-12 md:py-20 px-4 bg-gradient-to-b from-blue-900/10 to-black snap-start">
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-8 md:mb-16 px-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 text-white">
            Our Team
          </h2>
          <p className="text-gray-400 text-base md:text-lg">
            Developers who brought FULCRUM to life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto px-4">
          {team.map((member, index) => (
            <div 
              key={index}
              className="card-hover bg-black/40 backdrop-blur border border-blue-500/20 rounded-xl p-8 text-center hover:border-blue-500/50 transition group cursor-pointer flex flex-col items-center"
            >
              {member.avatar}
              <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-blue-400 transition">
                {member.name}
              </h3>
              <p className="text-blue-400 font-semibold mb-2">{member.role}</p>
              <p className="text-gray-400 mb-4">{member.description}</p>
              <a 
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition"
                onClick={(e) => e.stopPropagation()}
              >
                <span>GitHub</span>
                <Github className="w-5 h-5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="min-h-screen flex items-center justify-center border-t border-blue-500/20 py-12 px-4 snap-start">
      <div className="max-w-7xl mx-auto w-full">
        {/* Open Source Section */}
        <div className="text-center mb-12 px-4">
          <div className="max-w-3xl mx-auto mb-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 text-white">
              Open Source & Community Driven
            </h2>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-6">
              FULCRUM is fully open source. Everyone can contribute, review, and improve the codebase. 
              Join our community and help build the future of transparent prize distribution.
            </p>
            <div className="bg-black/40 backdrop-blur border border-blue-500/30 rounded-xl p-6 md:p-8 mb-8">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                Anyone Can Contribute
              </h3>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-4">
                Whether you're a developer, designer, or just passionate about blockchain transparency, 
                your contributions are welcome. Fork the repository, submit pull requests, report issues, 
                or simply spread the word.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-green-400" />
                  <span>Code contributions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircledIcon className="w-5 h-5 text-green-400" />
                  <span>Bug reports</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-green-400" />
                  <span>Feature suggestions</span>
                </div>
                <div className="flex items-center gap-2">
                  <InfoCircledIcon className="w-5 h-5 text-green-400" />
                  <span>Documentation</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-blue-500/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 px-4">
          <p className="text-gray-400 text-sm text-center md:text-left">
            ©️ 2025 FULCRUM. Built on SUI Blockchain. Open Source MIT License.
          </p>
          <div className="flex gap-6 text-gray-400 text-sm">
            <a href="#" className="hover:text-blue-400 transition">Privacy</a>
            <a href="#" className="hover:text-blue-400 transition">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main Landing Page Component
export default function LandingPage() {
  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-black text-white font-sans">
      <Hero />
      <Features />
      <HowItWorks />
      <AboutSection />
      <MembershipForm />
      <Team />
      <Footer />
    </div>
  );
}