import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { blogPosts } from '../data/blogPosts';
import { ArrowLeft, Clock, Calendar, ArrowRight, Share2 } from 'lucide-react';
import './Blog.css';
import SEOHead from '../components/SEOHead';

const BlogPost = () => {
    const { slug } = useParams();
    const ref = useScrollReveal();
    const post = blogPosts.find(p => p.slug === slug);

    if (!post) {
        return (
            <div ref={ref} style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <h1>Статията не е намерена</h1>
                    <Link to="/blog" className="btn-primary" style={{ marginTop: '2rem', display: 'inline-block' }}>Обратно към блога</Link>
                </div>
            </div>
        );
    }

    // Get related posts (same category, excluding current)
    const related = blogPosts.filter(p => p.category === post.category && p.slug !== post.slug).slice(0, 2);

    // Parse content into paragraphs
    const paragraphs = post.content.trim().split('\n').filter(line => line.trim());

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: post.title,
                    text: post.excerpt,
                    url: window.location.href,
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert("Връзката е копирана!");
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    return (
        <div ref={ref}>
            <SEOHead
                title={`${post.title} | Adaptica AI Блог`}
                description={post.excerpt}
                path={`/blog/${post.slug}`}
                image={post.image}
                jsonLd={[{
                    "@context": "https://schema.org",
                    "@type": "Article",
                    "headline": post.title,
                    "description": post.excerpt,
                    "datePublished": post.date,
                    "author": {
                        "@type": "Organization",
                        "name": "Adaptica AI"
                    },
                    "publisher": {
                        "@type": "Organization",
                        "name": "Adaptica AI",
                        "url": "https://adaptica.ai"
                    },
                    "url": `https://adaptica.ai/blog/${post.slug}`,
                    "mainEntityOfPage": `https://adaptica.ai/blog/${post.slug}`
                }]}
            />
            {/* Hero */}
            <section className="page-hero page-hero-dark blogpost-hero">
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <Link to="/blog" className="blogpost-back fade-in">
                        <ArrowLeft size={16} /> Обратно към блога
                    </Link>
                    <h1 className="fade-in">{post.title}</h1>
                    <div className="blogpost-meta fade-in">
                        <span><Calendar size={14} /> {post.date}</span>
                        <span><Clock size={14} /> {post.readTime} четене</span>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="blogpost-content section-padding">
                <div className="container">
                    <article className="blogpost-body fade-in">
                        {post.image && (
                            <img
                                src={post.image}
                                alt={post.title}
                                style={{ width: '100%', borderRadius: 'var(--radius-lg)', marginBottom: '3rem', boxShadow: 'var(--card-shadow)' }}
                            />
                        )}
                        {paragraphs.map((para, i) => {
                            const trimmed = para.trim();
                            if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
                                return <h2 key={i}>{trimmed.replace(/\*\*/g, '')}</h2>;
                            }
                            if (/^\d+\./.test(trimmed)) {
                                return <p key={i} className="blogpost-list-item">{trimmed}</p>;
                            }
                            return <p key={i}>{trimmed.replace(/\*\*/g, '')}</p>;
                        })}

                        <div className="blog-share-container fade-in delay-2">
                            <button className="blog-share-btn" onClick={handleShare}>
                                <Share2 size={18} /> Сподели Статията
                            </button>
                        </div>
                    </article>
                </div>
            </section>

            {/* Related Posts */}
            {related.length > 0 && (
                <section className="blogpost-related section-padding section-dark">
                    <div className="container">
                        <div className="section-header centered fade-in">
                            <h2>Свързани Статии</h2>
                        </div>
                        <div className="related-grid">
                            {related.map(r => (
                                <Link to={`/blog/${r.slug}`} key={r.slug} className="blog-card neo-card fade-in" style={{ background: 'var(--dark-card-bg)', border: '1px solid var(--dark-card-border)', color: 'var(--light-text)' }}>
                                    <div className="blog-card-top">
                                        <span className="blog-tag">{r.category}</span>
                                        <span className="blog-read-time" style={{ color: 'var(--muted-dark)' }}><Clock size={13} /> {r.readTime}</span>
                                    </div>
                                    <h3 style={{ color: 'var(--light-text)' }}>{r.title}</h3>
                                    <p style={{ color: 'var(--muted-dark)' }}>{r.excerpt}</p>
                                    <div className="blog-card-bottom">
                                        <span className="blog-date" style={{ color: 'rgba(240,240,244,0.4)' }}>{r.date}</span>
                                        <span className="blog-arrow"><ArrowRight size={16} /></span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default BlogPost;
