export const defaultCampaignId = "vikingdivers";

export const campaigns = {
    vikingdivers: {
        name: "Vikingdivers",
        characterIds: ["ori", "zoltas", "Sindri", "chirp"],
        features: {
            worldState: true,
            yggdrasilMead: true,
            customResources: true,
            diceRoller: true,
            skillGroups: true
        }
    },

    friendsGame: {
        name: "Friend's Game",
        characterIds: ["djinn", "plunder"],
        features: {
            worldState: false,
            yggdrasilMead: false,
            customResources: true,
            diceRoller: true,
            skillGroups: true
        }
    }
};