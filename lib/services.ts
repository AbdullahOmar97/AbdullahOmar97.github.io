export const getServices = (t: any) => [
    {
        id: "web-dev",
        title: t.services.items.webDev.title,
        description: t.services.items.webDev.description,
        details: t.services.items.webDev.details,
        features: ["Next.js & React", "High Performance", "SEO Optimized", "Secure Authentication", "Database Design"],
        price: "500",
        imageSrc: "/web-dev-placeholder.jpg",
    },
    {
        id: "ai-integration",
        title: t.services.items.aiIntegration.title,
        description: t.services.items.aiIntegration.description,
        details: t.services.items.aiIntegration.details,
        features: ["LLMs & RAG", "Workflow Automation", "Custom Agents", "Data Analysis", "Predictive Modeling"],
        price: "800",
        imageSrc: "/ai-placeholder.jpg",
    },
    {
        id: "consultation",
        title: t.services.items.consultation.title,
        description: t.services.items.consultation.description,
        features: ["Tech Stack Selection", "Architecture Design", "Digital Strategy", "Code Review", "Performance Optimization"],
        details: t.services.items.consultation.details,
        price: "100",
        imageSrc: "/consulting-placeholder.jpg",
    },
]

export const getServiceById = (t: any, id: string) => {
    const services = getServices(t)
    return services.find((s) => s.id === id)
}
