import { motion } from "framer-motion";

import PageHero from "../components/ui/PageHero";
import SectionContainer from "../components/ui/SectionContainer";
import SectionHeading from "../components/ui/SectionHeading";

const posts = [
  {
    title: "How to prepare for your first Himalayan winter trek",
    category: "Preparation",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80",
    excerpt:
      "Layering, fitness, hydration, and the small habits that make a snow campsite feel manageable.",
  },
  {
    title: "Hampta Pass: why crossover treks feel so dramatic",
    category: "Route guide",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80",
    excerpt:
      "A field-style guide to terrain shifts, pass day pacing, camps, and weather windows.",
  },
  {
    title: "What operators check before approving a booking",
    category: "Operations",
    image:
      "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=900&q=80",
    excerpt:
      "Availability, guide ratios, fitness fit, payments, and why request-first booking protects the trek.",
  },
];

const BlogPage = () => {
  return (
    <>
      <PageHero
        eyebrow="Guides and field notes"
        title="Trekking stories that help customers choose better"
        description="SEO-friendly expedition guides, packing advice, route notes, and operator workflow education."
        image="https://images.unsplash.com/photo-1445308394109-4ec2920981b1?auto=format&fit=crop&w=1800&q=80"
      />

      <SectionContainer>
          <SectionHeading
            eyebrow="Latest articles"
            title="Editorial content for adventure decisions"
            description="A dedicated content layer keeps the homepage focused while supporting search, education, and trust."
            align="left"
          />

          <div className="mt-12 grid gap-7 md:grid-cols-3">
            {posts.map((post, index) => (
              <motion.article
                key={post.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-slate-100"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-64 w-full object-cover"
                  loading="lazy"
                />
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                    {post.category}
                  </p>
                  <h2 className="font-heading mt-3 text-2xl font-bold text-ink">
                    {post.title}
                  </h2>
                  <p className="mt-3 leading-relaxed text-ink-muted">{post.excerpt}</p>
                </div>
              </motion.article>
            ))}
          </div>
      </SectionContainer>
    </>
  );
};

export default BlogPage;
