import mongoose from 'mongoose'

const portfolioSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },

    // Basic Info
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    location: { type: String },
    bio: { type: String },
    profileImage: { type: String },

    // Sections
    sections: {
        hero: {
            enabled: { type: Boolean, default: true },
            title: String,
            subtitle: String,
            backgroundImage: String,
        },
        about: {
            enabled: { type: Boolean, default: true },
            content: String,
            image: String,
        },
        skills: {
            enabled: { type: Boolean, default: true },
            items: [{ name: String, level: String }],
        },
        experience: {
            enabled: { type: Boolean, default: true },
            items: [
                {
                    title: String,
                    company: String,
                    duration: String,
                    description: String,
                },
            ],
        },
        education: {
            enabled: { type: Boolean, default: true },
            items: [
                {
                    degree: String,
                    school: String,
                    year: String,
                    details: String,
                },
            ],
        },
        projects: {
            enabled: { type: Boolean, default: true },
            items: [
                {
                    name: String,
                    description: String,
                    image: String,
                    link: String,
                    technologies: [String],
                },
            ],
        },
        testimonials: {
            enabled: { type: Boolean, default: false },
            items: [
                {
                    name: String,
                    role: String,
                    text: String,
                    image: String,
                },
            ],
        },
        contact: {
            enabled: { type: Boolean, default: true },
            email: String,
            phone: String,
            social: {
                linkedin: String,
                github: String,
                twitter: String,
                instagram: String,
            },
        },
    },

    // Design
    design: {
        colorScheme: { type: String, default: '#4f46e5' },
        accentColor: { type: String, default: '#FF6B7A' },
        font: { type: String, default: 'Inter' },
        layout: { type: String, default: 'modern' }, // modern, minimal, creative
    },

    // Generated Code
    htmlCode: { type: String },
    cssCode: { type: String },
    jsCode: { type: String },

    // Metadata
    slug: { type: String, unique: true, sparse: true },
    isPublished: { type: Boolean, default: false },
    viewCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

export default mongoose.models.Portfolio || mongoose.model('Portfolio', portfolioSchema)
