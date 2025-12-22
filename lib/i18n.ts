import type { Locale } from "discord.js";

type TranslationKey =
  | "errors.voiceChannelRequired"
  | "errors.noLavalinkNodes"
  | "errors.playerCreationFailed"
  | "errors.noResults"
  | "errors.spotifyNotConfigured"
  | "errors.spotifyInstructions"
  | "errors.spotifyAlternative"
  | "errors.noMatches"
  | "errors.loadTrackError"
  | "errors.generalError"
  | "errors.noPlayerActive"
  | "errors.noTrackPlaying"
  | "errors.queueEmpty"
  | "errors.noPreviousTrack"
  | "errors.invalidPage"
  | "errors.invalidTimeFormat"
  | "errors.trackNotSeekable"
  | "errors.seekBeyondDuration"
  | "errors.noPermission"
  | "errors.invalidPosition"
  | "errors.invalidRange"
  | "success.playlistAdded"
  | "success.trackAdded"
  | "success.trackSkipped"
  | "success.loopDisabled"
  | "success.loopTrack"
  | "success.loopQueue"
  | "success.queueCleared"
  | "success.playerPaused"
  | "success.playerResumed"
  | "success.queueShuffled"
  | "success.playingPrevious"
  | "success.seeked"
  | "success.tracksRemoved"
  | "commands.play.name"
  | "commands.play.description"
  | "commands.play.queryName"
  | "commands.play.queryDescription"
  | "commands.skip.name"
  | "commands.skip.description"
  | "commands.loop.name"
  | "commands.loop.description"
  | "commands.loop.modeName"
  | "commands.loop.modeDescription"
  | "commands.volume.name"
  | "commands.volume.description"
  | "commands.volume.levelName"
  | "commands.volume.levelDescription"
  | "commands.clear.name"
  | "commands.clear.description"
  | "commands.pause.name"
  | "commands.pause.description"
  | "commands.shuffle.name"
  | "commands.shuffle.description"
  | "commands.previous.name"
  | "commands.previous.description"
  | "commands.queue.name"
  | "commands.queue.description"
  | "commands.queue.pageName"
  | "commands.queue.pageDescription"
  | "commands.seek.name"
  | "commands.seek.description"
  | "commands.seek.timeName"
  | "commands.seek.timeDescription"
  | "commands.song.name"
  | "commands.song.description"
  | "commands.remove.name"
  | "commands.remove.description"
  | "commands.remove.positionName"
  | "commands.remove.positionDescription"
  | "success.volumeSet"
  | "success.volumeCurrent"
  | "errors.invalidVolume"
  | "embed.nowPlaying.title"
  | "embed.nowPlaying.description"
  | "embed.nowPlaying.requestedBy"
  | "embed.nowPlaying.duration"
  | "embed.nowPlaying.volume"
  | "embed.nowPlaying.queueLength"
  | "embed.nowPlaying.loop"
  | "embed.nowPlaying.status"
  | "embed.queue.title"
  | "embed.queue.footer"
  | "embed.queue.nowPlaying"
  | "embed.queue.upcoming";

type SupportedLocale = "pl" | "en-US" | "en-GB";

const translations: Record<SupportedLocale, Record<TranslationKey, string>> = {
  pl: {
    "errors.voiceChannelRequired": "❌ Musisz najpierw dołączyć do kanału głosowego!",
    "errors.noLavalinkNodes": "❌ Brak dostępnych węzłów Lavalink. Skontaktuj się z administratorem.",
    "errors.playerCreationFailed": "❌ Nie udało się utworzyć odtwarzacza. Brak dostępnych węzłów Lavalink.",
    "errors.noResults": "❌ Nie znaleziono wyników dla Twojego zapytania.",
    "errors.spotifyNotConfigured": "❌ Linki Spotify wymagają skonfigurowania danych uwierzytelniających API na serwerze Lavalink.\n\n",
    "errors.spotifyInstructions": "**Aby włączyć obsługę Spotify:**\n1. Uzyskaj dane uwierzytelniające z https://developer.spotify.com/dashboard\n2. Dodaj je do `application.yml` Lavalink:\n```yaml\nplugins:\n  lavasrc:\n    spotify:\n      clientId: \"twój-client-id\"\n      clientSecret: \"twój-client-secret\"\n```\n",
    "errors.spotifyAlternative": "\n**Alternatywa:** Wyszukaj po nazwie utworu zamiast używać linków Spotify.",
    "errors.noMatches": "❌ Nie znaleziono pasujących wyników dla Twojego zapytania!",
    "errors.loadTrackError": "❌ Wystąpił błąd podczas ładowania utworu.",
    "errors.generalError": "❌ Wystąpił błąd podczas próby odtworzenia muzyki.",
    "errors.noPlayerActive": "❌ Nie ma aktywnego odtwarzacza w tym serwerze.",
    "errors.noTrackPlaying": "❌ Obecnie nic nie jest odtwarzane.",
    "errors.queueEmpty": "❌ Kolejka jest pusta.",
    "errors.noPreviousTrack": "❌ Nie ma poprzedniego utworu.",
    "errors.invalidPage": "❌ Nieprawidłowy numer strony. Dostępne strony: 1-{totalPages}",
    "errors.invalidTimeFormat": "❌ Nieprawidłowy format czasu. Użyj formatu: 1h30m, 2:30, lub 90s",
    "errors.trackNotSeekable": "❌ Ten utwór nie obsługuje przewijania.",
    "errors.seekBeyondDuration": "❌ Nie można przewinąć poza czas trwania utworu.",
    "errors.noPermission": "❌ Nie masz uprawnień do używania tej komendy. Wymagane uprawnienia: Administrator, Zarządzanie serwerem lub Moderowanie członków.",
    "errors.invalidPosition": "❌ Nieprawidłowa pozycja. Kolejka zawiera utwory od 1 do {size}.",
    "errors.invalidRange": "❌ Nieprawidłowy zakres. Użyj formatu: 21-37 lub pojedynczej liczby.",
    "success.playlistAdded": "✅ Dodano playlistę **{name}** z {count} utworami do kolejki.",
    "success.trackAdded": "✅ Dodano **{title}** wykonawcy **{author}** do kolejki.",
    "success.trackSkipped": "⏭️ Pominięto utwór **{title}**.",
    "success.loopDisabled": "🔁 Pętla wyłączona.",
    "success.loopTrack": "🔂 Zapętlono bieżący utwór.",
    "success.loopQueue": "🔁 Zapętlono kolejkę.",
    "success.queueCleared": "🗑️ Kolejka została wyczyszczona.",
    "success.playerPaused": "⏸️ Odtwarzanie zostało wstrzymane.",
    "success.playerResumed": "▶️ Wznowiono odtwarzanie.",
    "success.queueShuffled": "🔀 Kolejka została przetasowana.",
    "success.playingPrevious": "⏮️ Odtwarzam poprzedni utwór: **{title}**.",
    "success.seeked": "⏩ Przewinięto do **{time}**.",
    "success.tracksRemoved": "🗑️ Usunięto {count} utwór(y) z kolejki.",
    "commands.play.name": "play",
    "commands.play.description": "Odtwórz utwór lub playlistę",
    "commands.play.queryName": "zapytanie",
    "commands.play.queryDescription": "Nazwa utworu, URL lub link do playlisty",
    "commands.skip.name": "skip",
    "commands.skip.description": "Pomiń bieżący utwór",
    "commands.loop.name": "loop",
    "commands.loop.description": "Ustaw tryb pętli",
    "commands.loop.modeName": "tryb",
    "commands.loop.modeDescription": "Tryb pętli: off (wyłączona), track (utwór), queue (kolejka)",
    "commands.volume.name": "volume",
    "commands.volume.description": "Ustaw lub wyświetl głośność",
    "commands.volume.levelName": "poziom",
    "commands.volume.levelDescription": "Poziom głośności (0-200). Pomiń aby zobaczyć aktualną głośność",
    "commands.clear.name": "clear",
    "commands.clear.description": "Wyczyść kolejkę utworów",
    "commands.pause.name": "pause",
    "commands.pause.description": "Wstrzymaj lub wznów odtwarzanie",
    "commands.shuffle.name": "shuffle",
    "commands.shuffle.description": "Przetasuj kolejkę utworów",
    "commands.previous.name": "previous",
    "commands.previous.description": "Odtwórz poprzedni utwór",
    "commands.queue.name": "queue",
    "commands.queue.description": "Wyświetl kolejkę utworów",
    "commands.queue.pageName": "strona",
    "commands.queue.pageDescription": "Numer strony do wyświetlenia",
    "commands.seek.name": "seek",
    "commands.seek.description": "Przewiń do określonego momentu utworu",
    "commands.seek.timeName": "czas",
    "commands.seek.timeDescription": "Czas w formacie: 1h30m, 2:30, lub 90s",
    "commands.song.name": "song",
    "commands.song.description": "Wyświetl szczegóły aktualnie odtwarzanego utworu",
    "commands.remove.name": "remove",
    "commands.remove.description": "Usuń utwory z kolejki",
    "commands.remove.positionName": "pozycja",
    "commands.remove.positionDescription": "Pozycja utworu lub zakres (np. 5 lub 21-37)",
    "success.volumeSet": "🔊 Głośność ustawiona na **{volume}%**.",
    "success.volumeCurrent": "🔊 Aktualna głośność: **{volume}%**.",
    "errors.invalidVolume": "❌ Głośność musi być liczbą od 0 do 200.",
    "embed.nowPlaying.title": "Teraz odtwarzane",
    "embed.nowPlaying.description": "{songTitle} wykonawcy {creatorName}",
    "embed.nowPlaying.requestedBy": "Requested by",
    "embed.nowPlaying.duration": "Czas trwania",
    "embed.nowPlaying.volume": "Głośność",
    "embed.nowPlaying.queueLength": "Utworów w kolejce",
    "embed.nowPlaying.loop": "Pętla",
    "embed.nowPlaying.status": "Status",
    "embed.queue.title": "📜 Kolejka utworów",
    "embed.queue.footer": "Strona {page}/{totalPages} • Łącznie utworów: {total}",
    "embed.queue.nowPlaying": "🎵 Teraz odtwarzane",
    "embed.queue.upcoming": "📋 Nadchodzące utwory",
  },
  "en-US": {
    "errors.voiceChannelRequired": "❌ You need to join a voice channel first!",
    "errors.noLavalinkNodes": "❌ No Lavalink nodes are available. Please contact an administrator.",
    "errors.playerCreationFailed": "❌ Failed to create player. No available Lavalink nodes.",
    "errors.noResults": "❌ No results found for your query.",
    "errors.spotifyNotConfigured": "❌ Spotify links require API credentials to be configured on the Lavalink server.\n\n",
    "errors.spotifyInstructions": "**To enable Spotify support:**\n1. Get credentials from https://developer.spotify.com/dashboard\n2. Add them to your Lavalink `application.yml`:\n```yaml\nplugins:\n  lavasrc:\n    spotify:\n      clientId: \"your-client-id\"\n      clientSecret: \"your-client-secret\"\n```\n",
    "errors.spotifyAlternative": "\n**Alternative:** Search by song name instead of using Spotify links.",
    "errors.noMatches": "❌ No matches found for your query!",
    "errors.loadTrackError": "❌ An error occurred while loading the track.",
    "errors.generalError": "❌ An error occurred while trying to play the music.",
    "errors.noPlayerActive": "❌ There is no active player in this server.",
    "errors.noTrackPlaying": "❌ Nothing is currently playing.",
    "errors.queueEmpty": "❌ The queue is empty.",
    "errors.noPreviousTrack": "❌ There is no previous track.",
    "errors.invalidPage": "❌ Invalid page number. Available pages: 1-{totalPages}",
    "errors.invalidTimeFormat": "❌ Invalid time format. Use: 1h30m, 2:30, or 90s",
    "errors.trackNotSeekable": "❌ This track does not support seeking.",
    "errors.seekBeyondDuration": "❌ Cannot seek beyond the track duration.",
    "errors.noPermission": "❌ You don't have permission to use this command. Required permissions: Administrator, Manage Server, or Moderate Members.",
    "errors.invalidPosition": "❌ Invalid position. Queue contains tracks from 1 to {size}.",
    "errors.invalidRange": "❌ Invalid range. Use format: 21-37 or a single number.",
    "success.playlistAdded": "✅ Added playlist **{name}** with {count} tracks to the queue.",
    "success.trackAdded": "✅ Added **{title}** by **{author}** to the queue.",
    "success.trackSkipped": "⏭️ Skipped **{title}**.",
    "success.loopDisabled": "🔁 Loop disabled.",
    "success.loopTrack": "🔂 Looping current track.",
    "success.loopQueue": "🔁 Looping queue.",
    "success.queueCleared": "🗑️ Queue has been cleared.",
    "success.playerPaused": "⏸️ Playback has been paused.",
    "success.playerResumed": "▶️ Playback resumed.",
    "success.queueShuffled": "🔀 Queue has been shuffled.",
    "success.playingPrevious": "⏮️ Playing previous track: **{title}**.",
    "success.seeked": "⏩ Seeked to **{time}**.",
    "success.tracksRemoved": "🗑️ Removed {count} track(s) from the queue.",
    "commands.play.name": "play",
    "commands.play.description": "Play a song or playlist",
    "commands.play.queryName": "query",
    "commands.play.queryDescription": "Song name, URL, or playlist link",
    "commands.skip.name": "skip",
    "commands.skip.description": "Skip the current track",
    "commands.loop.name": "loop",
    "commands.loop.description": "Set loop mode",
    "commands.loop.modeName": "mode",
    "commands.loop.modeDescription": "Loop mode: off (disabled), track (current track), queue (all tracks)",
    "commands.volume.name": "volume",
    "commands.volume.description": "Set or display volume",
    "commands.volume.levelName": "level",
    "commands.volume.levelDescription": "Volume level (0-200). Omit to see current volume",
    "commands.clear.name": "clear",
    "commands.clear.description": "Clear the music queue",
    "commands.pause.name": "pause",
    "commands.pause.description": "Pause or resume playback",
    "commands.shuffle.name": "shuffle",
    "commands.shuffle.description": "Shuffle the music queue",
    "commands.previous.name": "previous",
    "commands.previous.description": "Play the previous track",
    "commands.queue.name": "queue",
    "commands.queue.description": "Display the music queue",
    "commands.queue.pageName": "page",
    "commands.queue.pageDescription": "Page number to display",
    "commands.seek.name": "seek",
    "commands.seek.description": "Seek to a specific time in the track",
    "commands.seek.timeName": "time",
    "commands.seek.timeDescription": "Time in format: 1h30m, 2:30, or 90s",
    "commands.song.name": "song",
    "commands.song.description": "Display details of the currently playing track",
    "commands.remove.name": "remove",
    "commands.remove.description": "Remove tracks from the queue",
    "commands.remove.positionName": "position",
    "commands.remove.positionDescription": "Track position or range (e.g. 5 or 21-37)",
    "success.volumeSet": "🔊 Volume set to **{volume}%**.",
    "success.volumeCurrent": "🔊 Current volume: **{volume}%**.",
    "errors.invalidVolume": "❌ Volume must be a number between 0 and 200.",
    "embed.nowPlaying.title": "Now Playing",
    "embed.nowPlaying.description": "{songTitle} by {creatorName}",
    "embed.nowPlaying.requestedBy": "Requested by",
    "embed.nowPlaying.duration": "Duration",
    "embed.nowPlaying.volume": "Volume",
    "embed.nowPlaying.queueLength": "Songs in queue",
    "embed.nowPlaying.loop": "Loop",
    "embed.nowPlaying.status": "Status",
    "embed.queue.title": "📜 Music Queue",
    "embed.queue.footer": "Page {page}/{totalPages} • Total tracks: {total}",
    "embed.queue.nowPlaying": "🎵 Now Playing",
    "embed.queue.upcoming": "📋 Up Next",
  },
  "en-GB": {
    "errors.voiceChannelRequired": "❌ You need to join a voice channel first!",
    "errors.noLavalinkNodes": "❌ No Lavalink nodes are available. Please contact an administrator.",
    "errors.playerCreationFailed": "❌ Failed to create player. No available Lavalink nodes.",
    "errors.noResults": "❌ No results found for your query.",
    "errors.spotifyNotConfigured": "❌ Spotify links require API credentials to be configured on the Lavalink server.\n\n",
    "errors.spotifyInstructions": "**To enable Spotify support:**\n1. Get credentials from https://developer.spotify.com/dashboard\n2. Add them to your Lavalink `application.yml`:\n```yaml\nplugins:\n  lavasrc:\n    spotify:\n      clientId: \"your-client-id\"\n      clientSecret: \"your-client-secret\"\n```\n",
    "errors.spotifyAlternative": "\n**Alternative:** Search by song name instead of using Spotify links.",
    "errors.noMatches": "❌ No matches found for your query!",
    "errors.loadTrackError": "❌ An error occurred while loading the track.",
    "errors.generalError": "❌ An error occurred while trying to play the music.",
    "errors.noPlayerActive": "❌ There is no active player in this server.",
    "errors.noTrackPlaying": "❌ Nothing is currently playing.",
    "errors.queueEmpty": "❌ The queue is empty.",
    "errors.noPreviousTrack": "❌ There is no previous track.",
    "errors.invalidPage": "❌ Invalid page number. Available pages: 1-{totalPages}",
    "errors.invalidTimeFormat": "❌ Invalid time format. Use: 1h30m, 2:30, or 90s",
    "errors.trackNotSeekable": "❌ This track does not support seeking.",
    "errors.seekBeyondDuration": "❌ Cannot seek beyond the track duration.",
    "errors.noPermission": "❌ You don't have permission to use this command. Required permissions: Administrator, Manage Server, or Moderate Members.",
    "errors.invalidPosition": "❌ Invalid position. Queue contains tracks from 1 to {size}.",
    "errors.invalidRange": "❌ Invalid range. Use format: 21-37 or a single number.",
    "success.playlistAdded": "✅ Added playlist **{name}** with {count} tracks to the queue.",
    "success.trackAdded": "✅ Added **{title}** by **{author}** to the queue.",
    "success.trackSkipped": "⏭️ Skipped **{title}**.",
    "success.loopDisabled": "🔁 Loop disabled.",
    "success.loopTrack": "🔂 Looping current track.",
    "success.loopQueue": "🔁 Looping queue.",
    "success.queueCleared": "🗑️ Queue has been cleared.",
    "success.playerPaused": "⏸️ Playback has been paused.",
    "success.playerResumed": "▶️ Playback resumed.",
    "success.queueShuffled": "🔀 Queue has been shuffled.",
    "success.playingPrevious": "⏮️ Playing previous track: **{title}**.",
    "success.seeked": "⏩ Seeked to **{time}**.",
    "success.tracksRemoved": "🗑️ Removed {count} track(s) from the queue.",
    "commands.play.name": "play",
    "commands.play.description": "Play a song or playlist",
    "commands.play.queryName": "query",
    "commands.play.queryDescription": "Song name, URL, or playlist link",
    "commands.skip.name": "skip",
    "commands.skip.description": "Skip the current track",
    "commands.loop.name": "loop",
    "commands.loop.description": "Set loop mode",
    "commands.loop.modeName": "mode",
    "commands.loop.modeDescription": "Loop mode: off (disabled), track (current track), queue (all tracks)",
    "commands.volume.name": "volume",
    "commands.volume.description": "Set or display volume",
    "commands.volume.levelName": "level",
    "commands.volume.levelDescription": "Volume level (0-200). Omit to see current volume",
    "commands.clear.name": "clear",
    "commands.clear.description": "Clear the music queue",
    "commands.pause.name": "pause",
    "commands.pause.description": "Pause or resume playback",
    "commands.shuffle.name": "shuffle",
    "commands.shuffle.description": "Shuffle the music queue",
    "commands.previous.name": "previous",
    "commands.previous.description": "Play the previous track",
    "commands.queue.name": "queue",
    "commands.queue.description": "Display the music queue",
    "commands.queue.pageName": "page",
    "commands.queue.pageDescription": "Page number to display",
    "commands.seek.name": "seek",
    "commands.seek.description": "Seek to a specific time in the track",
    "commands.seek.timeName": "time",
    "commands.seek.timeDescription": "Time in format: 1h30m, 2:30, or 90s",
    "commands.song.name": "song",
    "commands.song.description": "Display details of the currently playing track",
    "commands.remove.name": "remove",
    "commands.remove.description": "Remove tracks from the queue",
    "commands.remove.positionName": "position",
    "commands.remove.positionDescription": "Track position or range (e.g. 5 or 21-37)",
    "success.volumeSet": "🔊 Volume set to **{volume}%**.",
    "success.volumeCurrent": "🔊 Current volume: **{volume}%**.",
    "errors.invalidVolume": "❌ Volume must be a number between 0 and 200.",
    "embed.nowPlaying.title": "Now Playing",
    "embed.nowPlaying.description": "{songTitle} by {creatorName}",
    "embed.nowPlaying.requestedBy": "Requested by",
    "embed.nowPlaying.duration": "Duration",
    "embed.nowPlaying.volume": "Volume",
    "embed.nowPlaying.queueLength": "Songs in queue",
    "embed.nowPlaying.loop": "Loop",
    "embed.nowPlaying.status": "Status",
    "embed.queue.title": "📜 Music Queue",
    "embed.queue.footer": "Page {page}/{totalPages} • Total tracks: {total}",
    "embed.queue.nowPlaying": "🎵 Now Playing",
    "embed.queue.upcoming": "📋 Up Next",
  },
};

export function t(
  locale: Locale | string,
  key: TranslationKey,
  params?: Record<string, string | number>
): string {
  // Map locale to supported locale, default to Polish
  let effectiveLocale: SupportedLocale = "pl";
  
  if (locale === "pl") {
    effectiveLocale = "pl";
  } else if (locale === "en-US" || locale === "en-GB" || locale.startsWith("en")) {
    effectiveLocale = locale === "en-GB" ? "en-GB" : "en-US";
  }
  
  let text = translations[effectiveLocale][key];

  // Replace parameters
  if (params) {
    Object.entries(params).forEach(([param, value]) => {
      text = text.replace(`{${param}}`, String(value));
    });
  }

  return text;
}
