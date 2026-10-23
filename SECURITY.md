# Security Policy · Sécurité

**[English](#english) · [Français](#français)**

---

## English

### Reporting a vulnerability

**Don't open a public issue.** Report privately through GitHub:

* [Report a vulnerability](https://github.com/olivierouellet/Mare-Tide-Card/security/advisories/new)
  from the repository's **Security** tab, visible only to the maintainer, or
* contact [@olivierouellet](https://github.com/olivierouellet) directly.

Useful to include: the version, what an attacker needs, and a way to reproduce it.

This is a one-maintainer, spare-time project. Expect acknowledgement within 2 weeks, and you'll
be told where the fix stands. Credit in the release notes if you'd like it.

### Supported versions

| Version | Supported |
| --- | --- |
| Latest release | ✅ |
| `main` | ✅ Fixes land here first |
| Earlier releases | ❌ Update through HACS |

### Attack surface

* With the Mare integration, the card only reads its sensor; it makes no request of its own.
* In direct mode, the browser downloads DFO’s station list and predictions (`api-iwls.dfo-mpo.gc.ca`), with no key and no personal data, and keeps them in local storage (24 hours for the stations, 6 hours for the predictions). The station picker ranks stations by distance in the browser, from the home location or, if you allow it, this device’s position: no position is sent.
* Nothing from those answers is inserted as HTML: the card only takes station names, numbers and times from them, and Lit escapes all the text it shows.

---

## Français

### Signaler une vulnérabilité

**N’ouvrez pas d’issue publique.** Signalez-la en privé par GitHub :

* [Signaler une vulnérabilité](https://github.com/olivierouellet/Mare-Tide-Card/security/advisories/new)
  dans l’onglet **Security** du dépôt, visible seulement par le responsable, ou
* écrivez directement à [@olivierouellet](https://github.com/olivierouellet).

Utile à inclure : la version, ce qu’il faut pour exploiter le problème, et une façon de le reproduire.

C’est un projet à un seul responsable, fait sur son temps libre. Comptez un accusé de réception
d’ici deux semaines; vous saurez où en est la correction. Vous serez crédité dans les notes de
version si vous le souhaitez.

### Versions prises en charge

| Version | Prise en charge |
| --- | --- |
| Dernière version publiée | ✅ |
| `main` | ✅ Les correctifs y arrivent d’abord |
| Versions antérieures | ❌ Mettez à jour avec HACS |

### Surface d’attaque

* Avec l’intégration Mare, la carte ne fait que lire son capteur; elle ne fait aucune requête.
* En mode direct, le navigateur télécharge la liste des stations et les prédictions du MPO (`api-iwls.dfo-mpo.gc.ca`), sans clé ni donnée personnelle, et les garde dans le stockage local (24 heures pour les stations, 6 heures pour les prédictions). Le sélecteur de station classe les stations par distance dans le navigateur, à partir du domicile ou, si vous l’autorisez, de la position de l’appareil : aucune position n’est envoyée.
* Rien de ces réponses n’est inséré comme HTML : la carte n’en extrait que des noms de stations, des nombres et des heures, et Lit échappe tout le texte affiché.
