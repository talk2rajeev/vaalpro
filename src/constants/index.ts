export const MOCK_PHARMA = [
  { id: 'PH-001', name: 'Global Pharma Corp', location: 'Jigni, Bangalore' },
  { id: 'PH-002', name: 'BioHealth Solutions' , location: 'Hyderabad'},
];

export const MOCK_PLANTS = [
  { id: 'PL-001', pharmaId: 'PH-001', name: 'Plant A - Mumbai', status: 'active', equipmentCount: 428, complianceRate: '97%' },
  { id: 'PL-002', pharmaId: 'PH-001', name: 'Plant B - Pune', status: 'active', equipmentCount: 316, complianceRate: '94%' },
  { id: 'PL-003', pharmaId: 'PH-002', name: 'BioPlant 1 - Bangalore', status: 'pending', equipmentCount: 212, complianceRate: '88%' },
];

export const MOCK_BLOCKS = [
  { id: 'BL-001', plantId: 'PL-001', name: 'Block A' },
  { id: 'BL-002', plantId: 'PL-001', name: 'Block B' },
];

export const MOCK_ROOMS = [
  { id: 'RM-001', blockId: 'BL-001', name: 'Room 101' },
  { id: 'RM-002', blockId: 'BL-001', name: 'Room 102' },
];

export const MOCK_EQUIPMENT = [
  { id: 'EQ-001', roomId: 'RM-001', name: 'AHU-01', type: 'HVAC', status: 'In Progress' },
  { id: 'EQ-002', roomId: 'RM-001', name: 'Incubator-05', type: 'Lab', status: 'Completed' },
  { id: 'EQ-003', roomId: 'RM-002', name: 'Autoclave-02', type: 'Sterilization', status: 'Pending' },
];
