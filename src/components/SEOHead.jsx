import { useEffect } from 'react';

/**
 * SEOHead — Dynamic per-page SEO metadata and JSON-LD structured data.
 * Updates document.title, meta description, canonical URL, and injects JSON-LD schemas.
 */
const SEOHead = ({ title, description, path = '/', jsonLd = [], image }) => {
    useEffect(() => {
        // Update title
        document.title = title;

        // Update meta description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', description);
        }

        // Update OG tags
        let ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', title);

        let ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute('content', description);

        let ogUrl = document.querySelector('meta[property="og:url"]');
        if (!ogUrl) {
            ogUrl = document.createElement('meta');
            ogUrl.setAttribute('property', 'og:url');
            document.head.appendChild(ogUrl);
        }
        ogUrl.setAttribute('content', `https://adaptica.ai${path}`);

        if (image) {
            let ogImage = document.querySelector('meta[property="og:image"]');
            if (!ogImage) {
                ogImage = document.createElement('meta');
                ogImage.setAttribute('property', 'og:image');
                document.head.appendChild(ogImage);
            }
            ogImage.setAttribute('content', `https://adaptica.ai${image}`);
        }

        // Update canonical
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', `https://adaptica.ai${path}`);

        // Inject JSON-LD
        const scriptIds = [];
        jsonLd.forEach((schema, i) => {
            const id = `jsonld-${i}`;
            scriptIds.push(id);
            let script = document.getElementById(id);
            if (!script) {
                script = document.createElement('script');
                script.id = id;
                script.type = 'application/ld+json';
                document.head.appendChild(script);
            }
            script.textContent = JSON.stringify(schema);
        });

        // Cleanup old JSON-LD scripts on unmount
        return () => {
            scriptIds.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.remove();
            });
        };
    }, [title, description, path, jsonLd, image]);

    return null;
};

// ─── Shared Schema Definitions ───────────────────────────────────────────

export const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Adaptica AI",
    "alternateName": "Адаптика AI",
    "url": "https://adaptica.ai",
    "logo": "https://adaptica.ai/logo.png",
    "description": "Adaptica AI е водещата AI агенция в България. Предоставяме AI трансформация, автоматизация на бизнес процеси, AI агенти, AI CRM системи и AI обучения за екипи.",
    "foundingDate": "2023",
    "areaServed": {
        "@type": "Country",
        "name": "Bulgaria"
    },
    "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+359877008951",
        "email": "office@adaptica.ai",
        "contactType": "customer service",
        "availableLanguage": ["Bulgarian", "English"]
    },
    "sameAs": [],
    "knowsAbout": [
        "Изкуствен интелект",
        "AI трансформация",
        "Автоматизация на бизнес процеси",
        "AI агенти",
        "CRM системи с AI",
        "AI обучения",
        "Машинно обучение",
        "Чатботове"
    ]
};

export const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Adaptica AI",
    "@id": "https://adaptica.ai/#business",
    "url": "https://adaptica.ai",
    "telephone": "+359877008951",
    "email": "office@adaptica.ai",
    "address": {
        "@type": "PostalAddress",
        "addressCountry": "BG",
        "addressLocality": "България"
    },
    "priceRange": "$$",
    "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
    }
};

export const createServiceSchema = (name, description, url) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": name,
    "description": description,
    "url": `https://adaptica.ai${url}`,
    "provider": {
        "@type": "Organization",
        "name": "Adaptica AI",
        "url": "https://adaptica.ai"
    },
    "areaServed": {
        "@type": "Country",
        "name": "Bulgaria"
    },
    "availableChannel": {
        "@type": "ServiceChannel",
        "serviceUrl": "https://adaptica.ai/book",
        "servicePhone": {
            "@type": "ContactPoint",
            "telephone": "+359877008951"
        }
    }
});

export const createFAQSchema = (faqs) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
        }
    }))
});

export default SEOHead;
