import Levenshtein as lev
from Levenshtein import distance


def check_phishing_risk(site_testado):
    dominios = [
        'google.com', 
        'amazon.com', 
        'apple.com',
        'microsoft.com', 
        'instagram.com',
        'youtube.com', 
        'facebook.com'
    ]

    site_testado = site_testado.lower() .replace ('http://', '') .replace ('https://', '') .replace ('www.', '')
    distancia_minima = float ('inf')
    site_minimo = ''

    for site in dominios:
        distancia_atual = distance(site, site_testado)

        if distancia_atual < distancia_minima:
            distancia_minima = distancia_atual
            site_minimo = site

    if distancia_minima <= 2:
        return {
            "status": "ALERTA",
            "score": "90.00%",
            "reason": f"ALTA SIMILARIDADE ({distancia_minima} com {site_minimo}. Não clique!"
        }
    else:
        return {
            "status": "OK",
            "score": "100.00%",
            "reason": "Site confiável."
        }