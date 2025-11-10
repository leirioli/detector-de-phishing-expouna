
import Levenshtein as lev

def testa_sites(site_testado):
    dominios = (['google.com', 
                 'amazon.com', 
                 'youtube.com', 
                 'facebook.com'])

    distancia_minima = 1000

    for site in dominios:
        distancia_atual = lev.distance (site, site_testado)

        if distancia_atual < distancia_minima:
            distancia_minima = distancia_atual
            site_minimo = site

    if distancia_minima >= 2:
        print (f'\nVocê não está acessando um site confiável, o endereço correto é {site_minimo}')
    else:
        print ('\nVocê está acessando um site confiável!')

