"use client"

import { useEffect } from "react"

/**
 * Показва елементите с атрибут data-rv, когато влязат в екрана.
 * Един наблюдател за целия сайт; следи и за съдържание, добавено по-късно.
 */
export default function RevealObserver() {
  useEffect(() => {
    const root = document.querySelector(".site-root")
    if (!root) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in")
            io.unobserve(entry.target)
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    )

    const scan = (scope: ParentNode) => {
      scope.querySelectorAll("[data-rv]:not(.in)").forEach((el) => io.observe(el))
    }
    scan(root)

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return
          if (node.matches("[data-rv]:not(.in)")) io.observe(node)
          scan(node)
        })
      }
    })
    mo.observe(root, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])

  return null
}
