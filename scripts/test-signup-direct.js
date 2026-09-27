const { chromium } = require('playwright');
const { createClient } = require('@supabase/supabase-js');

// Tester l'API Supabase directement avec les mêmes credentials que le client Next.js
const supabaseUrl = 'https://jjwzlgvpgrnyhufgbjah.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWYiOiJKindlyLCJyb2xlIjoiYW5vbiIsImtleXMiOltdfQ.ob5r7mVkq5QkWi3J9YkLBbIDjewQE0PUrsDloJ6mj4k';

async function testDirectSignUp() {
    console.log('=== TEST SIGNUP DIRECT ===');
    console.log('URL:', supabaseUrl);
    console.log('Key length:', anonKey.length);
    
    const supabase = createClient(supabaseUrl, anonKey);
    
    const email = 'test_direct_' + Date.now() + '@lenspro.test';
    const password = 'TestLensPro2026!';
    
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: 'Photographe Test Direct',
                    username: 'test_direct',
                    city: 'Kinshasa',
                    specialty: 'Mariage'
                }
            }
        });
        
        if (error) {
            console.log('ERREUR:', error.message);
            console.log('Erreur statut:', error.status);
            console.log('Erreur code:', error.code);
        } else {
            console.log('SUCCÈS!');
            console.log('User:', data.user?.id);
            console.log('Session:', data.session ? 'oui' : 'non');
            console.log('URL de confirmation:', data?.user?.confirmation_sent_at ? 'Envoyée' : 'Non envoyée');
        }
    } catch(e) {
        console.log('EXCEPTION:', e.message);
    }
}

testDirectSignUp().then(() => {
    console.log('\n=== TEST COMPLET ===');
}).catch(e => console.log('FATAL:', e));
