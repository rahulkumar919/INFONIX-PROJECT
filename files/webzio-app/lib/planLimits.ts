// Plan limits and enforcement

export interface PlanLimits {
    stores: number // -1 = unlimited
    menuItems: number
    templates: number
    customDomain: boolean
    analytics: boolean
    apiAccess: boolean
    whiteLabel: boolean
    prioritySupport: boolean
    storage: string
}

export const PLAN_LIMITS: Record<'free' | 'pro' | 'business', PlanLimits> = {
    free: {
        stores: 1,
        menuItems: 10,
        templates: 5,
        customDomain: false,
        analytics: false,
        apiAccess: false,
        whiteLabel: false,
        prioritySupport: false,
        storage: '100MB'
    },
    pro: {
        stores: 5,
        menuItems: -1, // unlimited
        templates: 25,
        customDomain: true,
        analytics: true,
        apiAccess: false,
        whiteLabel: true,
        prioritySupport: true,
        storage: '5GB'
    },
    business: {
        stores: -1, // unlimited
        menuItems: -1,
        templates: -1,
        customDomain: true,
        analytics: true,
        apiAccess: true,
        whiteLabel: true,
        prioritySupport: true,
        storage: '50GB'
    }
}

export function getPlanLimits(plan: 'free' | 'pro' | 'business'): PlanLimits {
    return PLAN_LIMITS[plan]
}

export function canCreateStore(currentCount: number, plan: 'free' | 'pro' | 'business'): boolean {
    const limits = getPlanLimits(plan)
    if (limits.stores === -1) return true
    return currentCount < limits.stores
}

export function canAddMenuItem(currentCount: number, plan: 'free' | 'pro' | 'business'): boolean {
    const limits = getPlanLimits(plan)
    if (limits.menuItems === -1) return true
    return currentCount < limits.menuItems
}

export function canUseTemplate(templateId: string, plan: 'free' | 'pro' | 'business'): boolean {
    const limits = getPlanLimits(plan)
    if (limits.templates === -1) return true

    // Free plan: templates 1-5
    // Pro plan: templates 1-25
    // Business: all templates
    const templateNumber = parseInt(templateId.replace('template-', ''))
    return templateNumber <= limits.templates
}

export function hasFeatureAccess(feature: keyof PlanLimits, plan: 'free' | 'pro' | 'business'): boolean {
    const limits = getPlanLimits(plan)
    return !!limits[feature]
}
