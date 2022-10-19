const parse_timestamp = (s) => {
    //let match = s.match(/^(?:([0-9]{2,}):)?([0-5][0-9]):([0-5][0-9][.,][0-9]{0,3})/);
    // Relaxing the timestamp format:
    let match = s.match(/^(?:([0-9]+):)?([0-5][0-9]):([0-5][0-9](?:[.,][0-9]{0,3})?)/);
    if (match == null) {
        throw 'Invalid timestamp format: ' + s;
    }
    let hours = parseInt(match[1] || "0", 10);
    let minutes = parseInt(match[2], 10);
    let seconds = parseFloat(match[3].replace(',', '.'));
    return seconds + 60 * minutes + 60 * 60 * hours;
}

const quick_and_dirty_vtt_or_srt_parser = (vtt) => {
    let lines = vtt.trim().replace('\r\n', '\n').split(/[\r\n]/).map(function(line) {
        return line.trim();
    });
    let cues = [];
    let start = null;
    let end = null;
    let payload = null;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].indexOf('-->') >= 0) {
            let splitted = lines[i].split(/[ \t]+-->[ \t]+/);
            if (splitted.length != 2) {
                throw 'Error when splitting "-->": ' + lines[i];
            }

            // Already ignoring anything past the "end" timestamp (i.e. cue settings).
            start = parse_timestamp(splitted[0]);
            end = parse_timestamp(splitted[1]);
        } else if (lines[i] == '') {
            if (start && end) {
                let cue = new VTTCue(start, end, payload);
                cues.push(cue);
                start = null;
                end = null;
                payload = null;
            }
        } else if(start && end) {
            if (payload == null) {
                payload = lines[i];
            } else {
                payload += '\n' + lines[i];
            }
        }
    }
    if (start && end) {
        let cue = new VTTCue(start, end, payload);
        cues.push(cue);
    }

    return cues;
}

 
const init = () => {
    // http://www.html5rocks.com/en/tutorials/track/basics/
    // https://www.iandevlin.com/blog/2015/02/javascript/dynamically-adding-text-tracks-to-html5-video
    let video = document.querySelector('video');
    let subtitle = document.getElementById('subtitle');
    let track = video.addTextTrack('subtitles', subtitle.dataset.label, subtitle.dataset.lang);
    track.mode = "showing";
    quick_and_dirty_vtt_or_srt_parser(subtitle.innerHTML).map(function(cue) {
        track.addCue(cue);
    });
}
init();