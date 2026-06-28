// Acquisition Cost Vector — cost is not one number.
//
// A knowledge event costs money, time, lab occupancy, people, equipment, and
// sometimes an external dependency (an outside lab). ROI is therefore not
// one-dimensional. This models the full vector and a normalized composite so the
// priority engine and the R&D-plan optimizer can trade them off honestly.
// Money/time are estimates until wired to real Priority/procurement data.

export const COST_VECTORS = {
  FIRST_SET_TIME:        { ils: 600,   days: 3,  technicians: 1, equipment: 'Vicat',               external: false },
  FIRST_PULL_OFF:        { ils: 1200,  days: 5,  technicians: 1, equipment: 'Pull-off tester',     external: false },
  SEM_AFTER_COMPRESSION: { ils: 2500,  days: 14, technicians: 1, equipment: 'SEM',                 external: true  },
  FREEZE_THAW:           { ils: 9000,  days: 60, technicians: 1, equipment: 'Climate chamber',     external: false },
  EN13381_FIRE_RATING:   { ils: 18000, days: 45, technicians: 2, equipment: 'Fire furnace',        external: true  },
  FIRE_CONE_CALORIMETER: { ils: 3000,  days: 10, technicians: 1, equipment: 'Cone calorimeter',    external: true  },
  COLOR_QUV_WEATHERING:  { ils: 2500,  days: 21, technicians: 1, equipment: 'QUV chamber',         external: false },
  SALT_SPRAY:            { ils: 18000, days: 40, technicians: 2, equipment: 'Salt-spray chamber',  external: true  },
};

/** Normalized composite cost (0..1) across the vector — weighted. */
export function costComposite(v, maxes) {
  return +(
    0.40 * (v.ils / maxes.ils) +
    0.30 * (v.days / maxes.days) +
    0.20 * (v.technicians / maxes.technicians) +
    0.10 * (v.external ? 1 : 0)
  ).toFixed(3);
}

export function costMaxes(vectors = Object.values(COST_VECTORS)) {
  return {
    ils: Math.max(...vectors.map((v) => v.ils)),
    days: Math.max(...vectors.map((v) => v.days)),
    technicians: Math.max(...vectors.map((v) => v.technicians)),
  };
}
