const limits = {
  free: { alerts: 5, apiCallsPerMinute: 30 },
  pro: { alerts: 50, apiCallsPerMinute: 120 },
  premium: { alerts: 500, apiCallsPerMinute: 300 }
};

export function ensurePlan(feature) {
  return (req, res, next) => {
    const plan = req.user?.plan ?? 'free';
    const value = limits[plan]?.[feature];
    if (value === undefined) return next();
    req.planLimit = value;
    next();
  };
}

export const planLimits = limits;
