"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Gift, Star, Crown, Mail, Loader2 } from "lucide-react"

export function NewsletterCTA() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSubscribed(true)
        setEmail("")
      } else {
        setError(data.error || "Une erreur est survenue")
      }
    } catch (error) {
      setError("Erreur de connexion. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubscribed) {
    return (
      <section id="newsletter" className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto">
              <Crown className="h-10 w-10 text-rose-500" />
            </div>
            <h3 className="text-3xl font-light text-white">Bienvenue dans la famille GLOW BY FC !</h3>
            <p className="text-white/90 font-light">
              Vous recevrez bientôt un email de bienvenue avec vos avantages exclusifs.
              <br />
              Vérifiez votre boîte de réception ! ✨
            </p>
            <Button
              onClick={() => setIsSubscribed(false)}
              variant="outline"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              S'abonner avec un autre email
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="newsletter" className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-8 lg:space-y-12">
          <div className="space-y-6">
            <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Mail className="mr-2 h-4 w-4" />
              Newsletter VIP
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white leading-tight">
              <span className="block">REJOIGNEZ NOS</span>
              <span className="block font-semibold">CLIENTS FIDÈLES</span>
            </h2>
            <p className="text-lg lg:text-xl text-white/90 font-light leading-relaxed max-w-2xl mx-auto">
              Recevez en exclusivité nos promotions, offres spéciales et avant-premières de collections
            </p>
          </div>

          

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <Input
              type="email"
              placeholder="Votre adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30 backdrop-blur-sm h-12 lg:h-14 text-base lg:text-lg"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-white text-gray-900 hover:bg-gray-100 font-medium h-12 lg:h-14 px-6 lg:px-8 whitespace-nowrap"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Inscription...
                </>
              ) : (
                "Rejoindre VIP"
              )}
            </Button>
          </form>

          {error && <p className="text-red-200 text-sm bg-red-500/20 rounded-lg p-3 max-w-lg mx-auto">{error}</p>}

          <p className="text-sm text-white/70 font-light">
            🎁 Email de bienvenue • Désinscription libre à tout moment
          </p>
        </div>
      </div>
    </section>
  )
}
