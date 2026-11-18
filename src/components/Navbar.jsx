"use client"

import * as React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import { Menu, X, ShoppingBag, User } from "lucide-react"
import { useShop } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"

const Navbar1 = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  // Read cart count and actions from shop context
  const { cartItemCount = 0, setIsCartOpen, setSelectedCategory } = useShop()
  // Read auth user status
  const { user } = useAuth()

  const toggleMenu = () => setIsOpen(!isOpen)

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Collections", path: "/catalog", category: "All Items" },
    { label: "Necklaces", path: "/catalog", category: "Necklaces" },
    { label: "Earrings", path: "/catalog", category: "Earrings" },
    { label: "Bangles", path: "/catalog", category: "Bracelets" },
  ]

  const handleNavClick = (item) => {
    if (item.category && setSelectedCategory) {
      setSelectedCategory(item.category)
    }
    navigate(item.path)
    setIsOpen(false)
  }

  return (
    <div className="flex justify-center w-full py-4 px-4 sticky top-0 z-50 pointer-events-none">
      <div className="flex items-center justify-between px-5 sm:px-7 py-2.5 bg-[#FAF7F2]/95 backdrop-blur-md rounded-full border border-[#B89B5E]/35 shadow-[0_8px_30px_rgba(31,58,50,0.12)] w-full max-w-4xl relative z-10 pointer-events-auto">
        
        {/* Left Corner: Replaced orange circle with Sushma Brand Logo & Monogram */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 mr-4 sm:mr-6 cursor-pointer select-none group"
        >
          <motion.div
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#142822] via-[#1F3A32] to-[#2A4C42] border border-[#B89B5E]/70 flex items-center justify-center shadow-xs flex-shrink-0"
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            whileHover={{ rotate: 12, scale: 1.08 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <span className="font-serif text-[#D4BE8D] font-bold text-sm tracking-wider">
              S
            </span>
          </motion.div>

          <div className="flex flex-col leading-tight">
            <span className="font-serif tracking-[0.22em] uppercase text-sm sm:text-base font-bold text-[#1F3A32] group-hover:text-[#B89B5E] transition-colors">
              Sushma
            </span>
            <span className="text-[8px] uppercase tracking-[0.28em] font-medium text-[#B89B5E]">
              Jewels
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
          {navItems.map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <button
                onClick={() => handleNavClick(item)}
                className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[#1F3A32]/85 hover:text-[#B89B5E] transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            </motion.div>
          ))}
        </nav>

        {/* Desktop CTA & Bag */}
        <div className="hidden md:flex items-center gap-3">
          {/* Quick Bag Trigger */}
          <motion.button
            onClick={() => setIsCartOpen && setIsCartOpen(true)}
            className="relative p-2 text-[#1F3A32] hover:text-[#B89B5E] transition-colors cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Shopping Bag"
            title="Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#B89B5E] text-[#142822] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </motion.button>

          {/* Desktop Auth / Account Button (Replaces Explore Edit) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            {user ? (
              <button
                onClick={() => navigate("/account")}
                className="inline-flex items-center gap-1.5 justify-center px-4 py-2 text-[11px] uppercase tracking-[0.16em] font-semibold text-[#FAF7F2] bg-[#1F3A32] hover:bg-[#142822] border border-[#B89B5E]/50 rounded-full shadow-xs hover:border-[#B89B5E] hover:shadow-[0_4px_16px_rgba(184,155,94,0.3)] transition-all cursor-pointer"
                title="View Account"
              >
                <User className="w-3.5 h-3.5 text-[#D4BE8D]" />
                <span>{user.name ? user.name.split(' ')[0] : 'Account'}</span>
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="inline-flex items-center gap-1.5 justify-center px-4 py-2 text-[11px] uppercase tracking-[0.16em] font-semibold text-[#FAF7F2] bg-[#1F3A32] hover:bg-[#142822] border border-[#B89B5E]/50 rounded-full shadow-xs hover:border-[#B89B5E] hover:shadow-[0_4px_16px_rgba(184,155,94,0.3)] transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-[#D4BE8D]" />
                <span>Log In / Sign Up</span>
              </button>
            )}
          </motion.div>
        </div>

        {/* Mobile Bag & Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setIsCartOpen && setIsCartOpen(true)}
            className="relative p-1.5 text-[#1F3A32]"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#B89B5E] text-[#142822] text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>

          <motion.button
            className="p-1.5 text-[#1F3A32]"
            onClick={toggleMenu}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6 text-[#1F3A32]" />
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-[#FAF7F2] z-50 pt-20 px-6 md:hidden flex flex-col justify-between pb-8 pointer-events-auto"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <motion.button
              className="absolute top-6 right-6 p-2 text-[#1F3A32] hover:text-[#B89B5E]"
              onClick={toggleMenu}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </motion.button>

            <div className="flex flex-col space-y-5 pt-4">
              {/* Header inside mobile drawer */}
              <div className="flex items-center gap-2.5 pb-4 border-b border-[#B89B5E]/20">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#142822] to-[#1F3A32] border border-[#B89B5E] flex items-center justify-center">
                  <span className="font-serif text-[#D4BE8D] font-bold text-sm">S</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-base tracking-[0.2em] uppercase font-bold text-[#1F3A32]">
                    Sushma
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.25em] text-[#B89B5E]">
                    Jewels
                  </span>
                </div>
              </div>

              {navItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 + 0.1 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <button
                    onClick={() => handleNavClick(item)}
                    className="text-sm uppercase tracking-[0.18em] font-medium text-[#1F3A32] hover:text-[#B89B5E] transition-colors w-full text-left py-1 cursor-pointer"
                  >
                    {item.label}
                  </button>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                exit={{ opacity: 0, y: 20 }}
                className="pt-4"
              >
                {user ? (
                  <button
                    className="inline-flex items-center justify-center w-full px-5 py-3 text-xs uppercase tracking-[0.18em] font-bold text-[#FAF7F2] bg-[#1F3A32] hover:bg-[#142822] border border-[#B89B5E] rounded-full transition-colors shadow-sm cursor-pointer gap-2"
                    onClick={() => {
                      navigate("/account")
                      toggleMenu()
                    }}
                  >
                    <User className="w-4 h-4 text-[#D4BE8D]" />
                    <span>My Account ({user.name ? user.name.split(' ')[0] : 'Profile'})</span>
                  </button>
                ) : (
                  <button
                    className="inline-flex items-center justify-center w-full px-5 py-3 text-xs uppercase tracking-[0.18em] font-bold text-[#FAF7F2] bg-[#1F3A32] hover:bg-[#142822] border border-[#B89B5E] rounded-full transition-colors shadow-sm cursor-pointer gap-2"
                    onClick={() => {
                      navigate("/login")
                      toggleMenu()
                    }}
                  >
                    <User className="w-4 h-4 text-[#D4BE8D]" />
                    <span>Log In / Sign Up</span>
                  </button>
                )}
              </motion.div>
            </div>

            <div className="text-center text-[10px] uppercase tracking-[0.22em] text-[#B89B5E] pt-6 border-t border-[#B89B5E]/20">
              Handcrafted Imitation Jewellery
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export { Navbar1, Navbar1 as Navbar }
export default Navbar1
