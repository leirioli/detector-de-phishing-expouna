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

    site_testado = site_testado.lower() .replace ('https://', '') .replace ('http://', '') .replace ('www.', '')

    if site_testado.endswith('/'):
        site_testado = site_testado[:-1]

    distancia_minima = float ('inf')
    site_minimo = ''

    for site in dominios:
        distancia_atual = distance(site, site_testado)

        if distancia_atual < distancia_minima:
            distancia_minima = distancia_atual
            site_minimo = site

    if distancia_minima == 0:
        return {
            "status": "OK",
            "score": "100.00%",
            "reason": "Correspondencia exata encontrada na lista de dominios seguros"
        }
    elif distancia_minima <= 2:
        return {
            "status": "ALERTA",
            "score": "90.00%",
            "reason": f"ALTA SIMILARIDADE {distancia_minima} com {site_minimo}. Nao clique!"
        }
    else:
        return {
            "status": "OK",
            "score": "10.00%",
            "reason": "Site confiavel."
        } 
