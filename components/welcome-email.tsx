interface WelcomeEmailProps {
  email: string
}

export function WelcomeEmail({ email }: WelcomeEmailProps) {
  const firstName = email.split("@")[0]

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenue dans la famille Glow by FC</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: #f9fafb;
            margin: 0;
            padding: 20px 0;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .header {
            background: #ffffff;
            padding: 48px 40px 32px;
            text-align: center;
            border-bottom: 1px solid #f3f4f6;
        }
        
        .logo {
            max-width: 120px;
            height: auto;
            border-radius: 16px;
            margin-bottom: 16px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .brand-tagline {
            font-size: 13px;
            color: #6b7280;
            font-weight: 400;
            letter-spacing: 0.5px;
        }
        
        .content {
            padding: 40px;
        }
        
        .welcome-section {
            text-align: center;
            margin-bottom: 40px;
        }
        
        .welcome-title {
            font-size: 24px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 8px;
            letter-spacing: -0.025em;
        }
        
        .welcome-subtitle {
            font-size: 16px;
            color: #6b7280;
            font-weight: 400;
        }
        
        .greeting {
            font-size: 16px;
            color: #374151;
            margin-bottom: 24px;
            line-height: 1.5;
        }
        
        .main-message {
            font-size: 15px;
            color: #4b5563;
            line-height: 1.7;
            margin-bottom: 32px;
        }
        
        .benefits-section {
            margin: 32px 0;
        }
        
        .benefits-title {
            font-size: 18px;
            font-weight: 600;
            color: #111827;
            text-align: center;
            margin-bottom: 24px;
        }
        
        .benefits-grid {
            display: grid;
            gap: 16px;
        }
        
        .benefit-item {
            background: #f9fafb;
            border-radius: 12px;
            padding: 20px;
            border: 1px solid #f3f4f6;
            transition: all 0.2s ease;
        }
        
        .benefit-header {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
        }
        
        .benefit-icon {
            font-size: 24px;
            margin-right: 16px;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', 'Segoe UI Symbol', sans-serif;
            line-height: 1;
        }
        
        .benefit-title {
            font-size: 15px;
            font-weight: 600;
            color: #111827;
        }
        
        .benefit-description {
            font-size: 14px;
            color: #6b7280;
            line-height: 1.5;
            margin-left: 40px;
        }
        
        .commitment-section {
            background: #f9fafb;
            border-radius: 12px;
            padding: 24px;
            margin: 32px 0;
            border: 1px solid #f3f4f6;
            text-align: center;
        }
        
        .commitment-title {
            font-size: 16px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 8px;
        }
        
        .commitment-text {
            font-size: 14px;
            color: #6b7280;
            line-height: 1.6;
        }
        
        .cta-section {
            text-align: center;
            margin: 40px 0;
        }
        
        .cta-text {
            font-size: 15px;
            color: #4b5563;
            margin-bottom: 20px;
        }
        
        .cta-button {
            display: inline-block;
            background: #111827;
            color: white;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 500;
            font-size: 14px;
            letter-spacing: 0.025em;
            transition: all 0.2s ease;
        }
        
        .cta-button:hover {
            background: #1f2937;
            transform: translateY(-1px);
        }
        
        .social-section {
            text-align: center;
            margin: 32px 0;
            padding: 20px;
            background: #f9fafb;
            border-radius: 12px;
            border: 1px solid #f3f4f6;
        }
        
        .social-title {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 8px;
            font-weight: 500;
        }
        
        .social-handle {
            font-size: 16px;
            color: #111827;
            font-weight: 600;
            text-decoration: none;
        }
        
        .footer {
            background: #f9fafb;
            padding: 32px 40px;
            text-align: center;
            border-top: 1px solid #f3f4f6;
        }
        
        .footer-brand {
            font-size: 14px;
            color: #111827;
            font-weight: 600;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
        }
        
        .footer-tagline {
            font-size: 13px;
            color: #6b7280;
            margin-bottom: 16px;
        }
        
        .footer-links {
            margin-bottom: 20px;
        }
        
        .footer-links a {
            color: #4b5563;
            text-decoration: none;
            font-size: 13px;
            margin: 0 12px;
            font-weight: 500;
        }
        
        .footer-links a:hover {
            color: #111827;
        }
        
        .unsubscribe {
            font-size: 12px;
            color: #9ca3af;
            line-height: 1.5;
            max-width: 400px;
            margin: 0 auto;
        }
        
        /* Desktop optimizations */
        @media only screen and (min-width: 601px) {
            .benefit-icon {
                font-size: 28px;
                margin-right: 20px;
            }
            
            .benefit-description {
                margin-left: 48px;
            }
        }
        
        /* Responsive Design */
        @media only screen and (max-width: 600px) {
            body {
                padding: 10px 0;
            }
            
            .email-container {
                margin: 0 10px;
                border-radius: 12px;
            }
            
            .content, .header, .footer {
                padding-left: 24px;
                padding-right: 24px;
            }
            
            .header {
                padding-top: 32px;
                padding-bottom: 24px;
            }
            
            .content {
                padding-top: 32px;
                padding-bottom: 32px;
            }
            
            .welcome-title {
                font-size: 22px;
            }
            
            .logo {
                max-width: 100px;
                border-radius: 12px;
            }
            
            .benefit-description {
                margin-left: 0;
                margin-top: 8px;
            }
            
            .benefit-header {
                flex-direction: column;
                align-items: flex-start;
                text-align: left;
            }
            
            .benefit-icon {
                margin-right: 0;
                margin-bottom: 8px;
                font-size: 24px;
            }
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            .email-container {
                background: #ffffff;
            }
        }
        
        /* Emoji-specific optimizations */
        .benefit-icon {
            -webkit-text-size-adjust: none;
            -moz-text-size-adjust: none;
            -ms-text-size-adjust: none;
            text-size-adjust: none;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-JXR84CoEBCjV90TnPySlkecr0gATyB.png" alt="Glow by FC" class="logo">
            <p class="brand-tagline">Your daily dose of glow & style</p>
        </div>
        
        <!-- Main Content -->
        <div class="content">
            <!-- Welcome Section -->
            <div class="welcome-section">
                <h1 class="welcome-title">Bienvenue dans la famille Glow by FC</h1>
                <p class="welcome-subtitle">Nous sommes ravis de vous accueillir</p>
            </div>
            
            <div class="greeting">
                Bonjour <strong>${firstName}</strong>,
            </div>
            
            <div class="main-message">
                C'est avec un immense plaisir que nous vous accueillons au sein de la famille Glow by FC. 
                Nous nous engageons à vous offrir une expérience exceptionnelle et à maintenir les plus hauts 
                standards de qualité dans chaque article.
                <br><br>
                Vous serez désormais informé(e) en exclusivité de nos futures collections, promotions spéciales 
                et actualités. un privilège est réservé à nos clients les plus fidèles !
            </div>
            
            
            <!-- Commitment Section -->
            <div class="commitment-section">
                <h3 class="commitment-title">Notre engagement</h3>
                <p class="commitment-text">
                    Nous nous engageons à préserver la qualité exceptionnelle qui caractérise Glow by FC 
                    et à vous accompagner dans votre quête d'élégance et d'authenticité.
                </p>
            </div>
            
            <!-- CTA Section -->
            <div class="cta-section">
                <p class="cta-text">Découvrez dès maintenant nos dernières créations</p>
                <a href="https://instagram.com/glow_by_fc" class="cta-button">
                    Voir sur Instagram
                </a>
            </div>
            
            
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <div class="footer-brand">GLOW BY FC</div>
            <p class="footer-tagline">Créé avec passion en Tunisie</p>
            
            
            
            <div class="unsubscribe">
                Vous recevez cet email car vous vous êtes inscrit(e) à notre newsletter. 
                Vous pouvez vous désabonner à tout moment.
                <br><br>
                © 2025 Glow by FC. Tous droits réservés.
            </div>
        </div>
    </div>
</body>
</html>
  `
}
