const kolorTypow = {
	grass: '#78C850',
	poison: '#A040A0',
	fire: '#F08030',
	water: '#6890F0',
	electric: '#F8D030',
	psychic: '#F85888',
	ghost: '#705898',
	dragon: '#7038F8',
	dark: '#705848',
	rock: '#B8A038',
	ground: '#E0C068',
	fighting: '#C03028',
	ice: '#98D8D8',
	bug: '#A8B820',
	flying: '#A890F0',
	steel: '#B8B8D0',
	normal: '#A8A878',
	fairy: '#EE99AC',
}

let aktywneTypy = new Set()
let szukanaFraza = ''
let ulubione = JSON.parse(localStorage.getItem('ulubione') || '[]')

const siatka = document.getElementById('siatka')
const licznikUlubione = document.getElementById('licznikUlubione')
const inputSzukaj = document.getElementById('inputSzukaj')
const modal = document.getElementById('modal')
const modalTresc = document.getElementById('modalTresc')
const btnZamknijModal = document.getElementById('btnZamknijModal')
const btnTryb = document.getElementById('btnTryb')
const filtrTypow = document.getElementById('filtrTypow')
const btnUlubione = document.getElementById('btnUlubione')

const aktualizujLicznik = () => {
	licznikUlubione.textContent = ulubione.length
}

const zapiszUlubione = () => {
	localStorage.setItem('ulubione', JSON.stringify(ulubione))
	aktualizujLicznik()
}

const toggleUlubiony = id => {
	if (ulubione.includes(id)) {
		ulubione = ulubione.filter(u => u !== id)
	} else {
		ulubione.push(id)
	}
	zapiszUlubione()
	renderujPokemony()
}

const budujBadge = typ => {
	return `<span class="typBadge typ-${typ}">${typ}</span>`
}

const budujKarte = pokemon => {
	const czyUlubiony = ulubione.includes(pokemon.id)
	const typy = pokemon.typy.map(budujBadge).join('')
	const galarTag = pokemon.galar ? `<span class="galarTag">Galar</span>` : ''

	return `
        <article class="karta" data-id="${pokemon.id}">
            <div class="kartaGora">
                ${galarTag}
                <span class="numer">${pokemon.numer}</span>
                <figure class="kartaFigure">
                    <img src="${pokemon.zdjecie}" alt="${pokemon.nazwa}" loading="lazy" onerror="this.onerror=null;this.src=cdnMap[${pokemon.id}]||''">
                </figure>
            </div>
            <div class="kartaDol">
                <h2>${pokemon.nazwa}</h2>
                <div class="typy">${typy}</div>
                <p class="krotkaDesc">${pokemon.opis.substring(0, 80)}...</p>
                <div class="kartaAkcje">
                    <button class="btnSzczegoly" onclick="otworzModal(${pokemon.id})">Szczegóły</button>
                    <button class="btnUlubionyKarta ${czyUlubiony ? 'aktywny' : ''}" onclick="toggleUlubiony(${pokemon.id})">
                        ${czyUlubiony ? '❤︎⁠' : '♡'}
                    </button>
                </div>
            </div>
        </article>
    `
}

const renderujPokemony = () => {
	let lista = [...pokemony]

	if (aktywneTypy.size > 0) {
		lista = lista.filter(p => p.typy.some(t => aktywneTypy.has(t)))
	}

	if (szukanaFraza.length > 0) {
		const fraza = szukanaFraza.toLowerCase()
		lista = lista.filter(
			p => p.nazwa.toLowerCase().includes(fraza) || p.typy.some(t => t.includes(fraza)) || p.numer.includes(fraza),
		)
	}

	if (lista.length === 0) {
		siatka.innerHTML = `<p class="brakWynikow">Nie znaleziono żadnych Pokémonów.</p>`
		return
	}

	siatka.innerHTML = lista.map(budujKarte).join('')
}

const otworzModal = id => {
	const pokemon = pokemony.find(p => p.id === id)
	if (!pokemon) return

	const typy = pokemon.typy.map(budujBadge).join('')
	const galarTag = pokemon.galar ? `<span class="galarTag">Galar</span>` : ''

	modalTresc.innerHTML = `
        <div class="modalGlowka">
            <span class="numer">${pokemon.numer}</span>
            ${galarTag}
            <h2>${pokemon.nazwa}</h2>
            <div class="typy">${typy}</div>
        </div>
        <div class="modalSrodek">
            <figure class="modalFigure">
                <img src="${pokemon.zdjecie}" alt="${pokemon.nazwa}" onerror="this.onerror=null;this.src=cdnMap[${pokemon.id}]||''">
            </figure>
            <div class="modalInfo">
                <p class="modalOpis">${pokemon.opis}</p>
                <div class="modalStat">
                    <span>Wzrost</span><strong>${pokemon.wzrost}</strong>
                    <span>Waga</span><strong>${pokemon.waga}</strong>
                </div>
                <p><strong>Linia ewolucyjna:</strong> ${pokemon.ewolucja}</p>
                <p><strong>Zdolności:</strong> ${pokemon.zdolnosci.join(', ')}</p>
            </div>
        </div>
    `

	modal.classList.add('widoczny')
	document.body.classList.add('zablokowany')
}

const zamknijModal = () => {
	modal.classList.remove('widoczny')
	document.body.classList.remove('zablokowany')
}

const budujFiltrTypow = () => {
	const wszystkieTypy = [...new Set(pokemony.flatMap(p => p.typy))].sort()
	filtrTypow.innerHTML = wszystkieTypy
		.map(
			typ => `
        <button class="btnTyp typ-${typ}" data-typ="${typ}" onclick="toggleTyp('${typ}')">
            ${typ}
        </button>
    `,
		)
		.join('')
}

const toggleTyp = typ => {
	if (aktywneTypy.has(typ)) {
		aktywneTypy.delete(typ)
		document.querySelector(`.btnTyp[data-typ="${typ}"]`)?.classList.remove('aktywny')
	} else {
		aktywneTypy.add(typ)
		document.querySelector(`.btnTyp[data-typ="${typ}"]`)?.classList.add('aktywny')
	}
	renderujPokemony()
}

inputSzukaj.addEventListener('input', e => {
	szukanaFraza = e.target.value.trim()
	renderujPokemony()
})

btnZamknijModal.addEventListener('click', zamknijModal)

modal.addEventListener('click', e => {
	if (e.target === modal) zamknijModal()
})

document.addEventListener('keydown', e => {
	if (e.key === 'Escape') zamknijModal()
})

btnTryb.addEventListener('click', () => {
	document.body.classList.toggle('ciemny')
	const ciemny = document.body.classList.contains('ciemny')
	btnTryb.textContent = ciemny ? '☀︎ Jasny tryb' : '☾ Ciemny tryb'
	localStorage.setItem('tryb', ciemny ? 'ciemny' : 'jasny')
})

let pokazUlubione = false
btnUlubione.addEventListener('click', () => {
	pokazUlubione = !pokazUlubione
	btnUlubione.classList.toggle('aktywny', pokazUlubione)

	if (pokazUlubione) {
		siatka.innerHTML =
			pokemony
				.filter(p => ulubione.includes(p.id))
				.map(budujKarte)
				.join('') || `<p class="brakWynikow">Brak ulubionych Pokémonów.</p>`
	} else {
		renderujPokemony()
	}
})

const zapisanyTryb = localStorage.getItem('tryb')
if (zapisanyTryb === 'ciemny') {
	document.body.classList.add('ciemny')
	btnTryb.textContent = '☀︎ Jasny tryb'
}

aktualizujLicznik()
budujFiltrTypow()
renderujPokemony()
