
import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';

const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15' as any,
});

async function createProducts() {
    console.log("Creating products...");

    try {
        const blueprint = await stripe.products.create({
            name: 'AI Blueprint',
            description: 'Daily SMS Accountability Bot & Basic AI Venting',
            default_price_data: {
                currency: 'usd',
                unit_amount: 1500, // $15.00
                recurring: { interval: 'month' }
            }
        });
        console.log(`Blueprint Created: ${blueprint.default_price}`);

        const growth = await stripe.products.create({
            name: 'Growth Subscription',
            description: 'Full Salary Bridge Calculator & Unlimited Roadmap Generations',
            default_price_data: {
                currency: 'usd',
                unit_amount: 5000, // $50.00
                recurring: { interval: 'month' }
            }
        });
        console.log(`Growth Created: ${growth.default_price}`);

        const transformation = await stripe.products.create({
            name: 'Transformation Program',
            description: 'Lifetime Access, 1-on-1 Strategy, Resume Rewrite',
            default_price_data: {
                currency: 'usd',
                unit_amount: 200000, // $2,000.00
                recurring: undefined // One-time
            }
        });
        console.log(`Transformation Created: ${transformation.default_price}`);

        console.log("\n--- COPY THESE IDS ---");
        console.log(`AI BLUEPRINT ID: ${blueprint.default_price}`);
        console.log(`GROWTH ID: ${growth.default_price}`);
        console.log(`TRANSFORMATION ID: ${transformation.default_price}`);

    } catch (error) {
        console.error("Error creating products:", error);
    }
}

createProducts();
