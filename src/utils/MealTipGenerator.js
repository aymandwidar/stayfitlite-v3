export const getMealTip = (goal) => {
    const tips = {
        weight_loss: [
            "Try replacing one carb-heavy meal with a large salad with lean protein.",
            "Drink a glass of water before every meal to feel fuller faster.",
            "Snack on almonds or walnuts instead of chips for healthy fats.",
            "Focus on high-fiber foods like broccoli and lentils to stay satiated.",
            "Cut down on sugary drinks; try sparkling water with lemon instead."
        ],
        muscle_gain: [
            "Ensure you're getting protein within 30 minutes after your workout.",
            "Add a scoop of protein powder to your morning oats.",
            "Eat more complex carbs like sweet potatoes to fuel your heavy lifts.",
            "Don't skip meals; aim for 4-5 smaller meals to keep protein synthesis up.",
            "Cottage cheese is a great slow-digesting protein snack before bed."
        ],
        fitness: [
            "Eat a balanced breakfast with protein, healthy fats, and fiber.",
            "Stay hydrated! Your muscles need water to function efficiently.",
            "Incorporate more colorful vegetables into your dinner for micronutrients.",
            "Try to limit processed foods and focus on whole ingredients.",
            "Listen to your body; if you're hungry, eat nutrient-dense foods."
        ],
        flexibility: [
            "Stay hydrated to keep your joints lubricated and muscles elastic.",
            "Anti-inflammatory foods like berries and turmeric can help recovery.",
            "Magnesium-rich foods like spinach help with muscle relaxation.",
            "Omega-3s from fish or flaxseeds support joint health.",
            "Avoid excessive salt which can cause water retention and stiffness."
        ]
    };

    const goalTips = tips[goal] || tips['fitness'];
    const randomIndex = Math.floor(Math.random() * goalTips.length);
    return goalTips[randomIndex];
};
