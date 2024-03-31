class MarvelService{
    _apiKey = 'apikey=47779fb4550063a82e32caa2eac2fe08'
    _apiBase = 'https://gateway.marvel.com:443/v1/public/'
    _baseOffset = 210

    getResource = async (url) => {
        let res = await fetch(url)

        if(!res.ok){
            throw new Error(`Could not get info for ${url}, status: ${res.status}`)
        }
        return res.json()
    }

    getAllCharacters = async (offset = this._baseOffset) => {
        const res = await this.getResource(`${this._apiBase}characters?limit=6&offset=${offset}&${this._apiKey}`)
        return res.data.results.map(this._transformCharacter)
    }

    getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`)
        return this._transformCharacter(res.data.results[0])
    }

    _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }
}

export default MarvelService