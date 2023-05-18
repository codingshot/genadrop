/* eslint-disable import/prefer-default-export */
export const plans = {
  free: {
    type: "free",
    amount: "2000",
    description: "Up to 2,000 unique art generation",
    coveredCost: "Cost per collection",
    price: "0",
    subscription: "Continue",
    services: [
      {
        name: "Up to 2000 unique art generartion",
        available: true,
      },
      {
        name: "Unlimited preview",
        available: true,
      },
      {
        name: "Set conflict rule and art rarity",
        available: true,
      },
      {
        name: "Auto-save session progress",
        available: false,
      },
      {
        name: "Download collection with metadata",
        available: false,
      },
      {
        name: "Generate GIf",
        available: false,
      },
      {
        name: "Technical support",
        available: false,
      },
    ],
  },
  hobby: {
    type: "hobby",
    amount: "2000",
    description: "Up to 2,000 unique art generation",
    coveredCost: "Cost per collection",
    price: "100",
    subscription: "Upgrade",
    services: [
      {
        name: "Up to 2000 unique art generartion",
        available: true,
      },
      {
        name: "Unlimited preview",
        available: true,
      },
      {
        name: "Set conflict rule and art rarity",
        available: true,
      },
      {
        name: "Auto-save session progress",
        available: true,
      },
      {
        name: "Download collection with metadata",
        available: true,
      },
      {
        name: "Generate GIf",
        available: true,
      },
      {
        name: "Technical support",
        available: true,
      },
    ],
  },
  pro: {
    type: "pro",
    amount: "5000",
    description: "Up to 5,000 unique art generation",
    coveredCost: "Cost per collection",
    price: "200",
    subscription: "Upgrade",
    mostPopular: true,
    services: [
      {
        name: "Up to 5000 unique art generartion",
        available: true,
      },
      {
        name: "Unlimited preview",
        available: true,
      },
      {
        name: "Set conflict rule and art rarity",
        available: true,
      },
      {
        name: "Auto-save session progress",
        available: true,
      },
      {
        name: "Download collection with metadata",
        available: true,
      },
      {
        name: "Generate GIf",
        available: true,
      },
      {
        name: "Technical support",
        available: true,
      },
    ],
  },
  agency: {
    type: "agency",
    amount: "10000",
    description: "Up to 10000 unique art generation",
    coveredCost: "Cost per collection",
    price: "300",
    subscription: "Upgrade",
    services: [
      {
        name: "Up to 10000 unique art generartion",
        available: true,
      },
      {
        name: "Unlimited preview",
        available: true,
      },
      {
        name: "Set conflict rule and art rarity",
        available: true,
      },
      {
        name: "Auto-save session progress",
        available: true,
      },
      {
        name: "Download collection with metadata",
        available: true,
      },
      {
        name: "Generate GIf",
        available: true,
      },
      {
        name: "Technical support",
        available: true,
      },
    ],
  },
};
