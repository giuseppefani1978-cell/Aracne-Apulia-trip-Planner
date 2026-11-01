#!/usr/bin/env python3
"""Non-destructive portal browser checks: two links, isolated static UI, mobile layout."""
import os
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "portal" / "index.html").read_text(encoding="utf-8")
OUT = ROOT / "portal" / "qa-screenshots"
OUT.mkdir(parents=True, exist_ok=True)
EXPECTED = {
    "planner": "https://myapuliatrip.com/dist/index.html",
    "hirundu": "https://play.myapuliatrip.com/",
}

def run(browser_type, label, viewport, mobile=False, chrome_channel=False):
    kw = {"headless": True}
    if chrome_channel:
        kw["channel"] = "chrome"
    if os.environ.get("PORTAL_CHROMIUM_PATH") and browser_type.name == "chromium":
        kw.pop("channel", None)
        kw["executable_path"] = os.environ["PORTAL_CHROMIUM_PATH"]
        kw["args"] = ["--no-sandbox"]
    browser = browser_type.launch(**kw)
    context = browser.new_context(
        viewport=viewport, is_mobile=mobile, has_touch=mobile,
        device_scale_factor=2 if mobile else 1, locale="fr-FR",
        reduced_motion="reduce",
    )
    page = context.new_page()
    errors = []
    requests = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.on("request", lambda req: requests.append(req.url) if req.url.startswith("http") else None)
    page.set_content(HTML, wait_until="domcontentloaded")
    assert page.locator("article.portal").count() == 2, "Portails de même rang attendus"
    assert page.locator("#home").is_visible()
    for dest, url in EXPECTED.items():
        a = page.locator(f'[data-live="{dest}"]')
        assert a.count() == 1, f"Il faut exactement un lien {dest}"
        assert a.get_attribute("href") == url, f"Destination {dest} modifiée"
    dimensions = page.evaluate("({doc: document.documentElement.scrollWidth, win: innerWidth})")
    assert dimensions["doc"] <= dimensions["win"] + 1, f"Débordement horizontal : {label} {dimensions}"
    if mobile:
        assert page.locator("article.portal.planner").bounding_box()["y"] < page.locator("article.portal.game").bounding_box()["y"], "Cartes non empilées sur mobile"
    else:
        assert abs(page.locator("article.portal.planner").bounding_box()["y"] - page.locator("article.portal.game").bounding_box()["y"]) < 2, "Cartes non côte à côte sur ordinateur"
    page.locator('[data-route="architecture"]').first.click()
    assert page.locator("#architecture").is_visible(), "Navigation architecture impossible"
    page.locator('[data-route="home"]').first.click()
    assert page.locator("#home").is_visible(), "Retour à l'accueil impossible"
    page.screenshot(path=str(OUT / f"{label}.png"), full_page=True)
    assert not errors, f"Erreurs JavaScript : {errors}"
    assert not requests, f"Réseau sortant inattendu : {requests}"
    print(f"PASS {label} : 2 liens directs, navigation interne, présentation, réseau isolé")
    context.close()
    browser.close()

with sync_playwright() as p:
    run(p.chromium, "desktop-chrome", {"width": 1440, "height": 900}, chrome_channel=True)
    run(p.chromium, "android-chrome-emulation", {"width": 393, "height": 873}, mobile=True, chrome_channel=True)
    if os.environ.get("PORTAL_WEBKIT") == "1":
        run(p.webkit, "iphone-webkit-emulation", {"width": 390, "height": 844}, mobile=True)
    else:
        run(p.chromium, "iphone-size-chrome-emulation", {"width": 390, "height": 844}, mobile=True, chrome_channel=True)
