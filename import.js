// Custom MediaTomb import script.

function addAudio(obj) {
 
    var title, artist, album, date, genre, description, track, chain,
        artist_full, album_full, temp,
        desc = '';


    // first gather data

    title = obj.meta['M_TITLE'] || obj.title;

    artist = obj.meta['M_ARTIST'];
    if (!artist) {
        artist = 'Unknown';
        artist_full = null;
    } else {
        artist_full = artist;
        desc = artist;
    }
    
    album = obj.meta['M_ALBUM'];
    if (!album) {
        album = 'Unknown';
        album_full = null;
    } else {
        desc = desc + ', ' + album;
        album_full = album;
    }
    
    if (desc) {
        desc = desc + ', ';
    }
    
    desc = desc + title;
    
    date = obj.meta['M_DATE'];
    if (!date) {
        date = 'Unknown';
    } else {
        date = getYear(date);
        desc = desc + ', ' + date;
    }
    
    genre = obj.meta['M_GENRE'];
    if (!genre) {
        genre = 'Unknown';
    } else {
        desc = desc + ', ' + genre;
    }
    
    description = obj.meta['M_DESCRIPTION'] || desc;

    track = '';

    chain = ['Audio', 'All Audio'];
    obj.title = title;
    addCdsObject(obj, createContainerChain(chain));
    
    chain = ['Audio', 'Artists', artist, 'All Songs'];
    addCdsObject(obj, createContainerChain(chain));
    
    chain = ['Audio', 'All - full name'];
    temp = '';
    if (artist_full) {
        temp = artist_full;
    }
    if (album_full) {
        temp = temp + ' - ' + album_full + ' - ';
    } else {
        temp = temp + ' - ';
    }

    obj.title = temp + title;
    addCdsObject(obj, createContainerChain(chain));
    
    chain = ['Audio', 'Artists', artist, 'All - full name'];
    addCdsObject(obj, createContainerChain(chain));
    
    chain = ['Audio', 'Artists', artist, album];
    obj.title = track + title;
    addCdsObject(obj, createContainerChain(chain), 'UPNP_CLASS_CONTAINER_MUSIC_ALBUM');
    
    chain = ['Audio', 'Albums', album];
    obj.title = track + title; 
    addCdsObject(obj, createContainerChain(chain), 'UPNP_CLASS_CONTAINER_MUSIC_ALBUM');
    
    chain = ['Audio', 'Genres', genre];
    addCdsObject(obj, createContainerChain(chain), 'UPNP_CLASS_CONTAINER_MUSIC_GENRE');
    
    chain = ['Audio', 'Year', date];
    addCdsObject(obj, createContainerChain(chain));
}

function addVideo(obj) {
    var chain, dir;

    chain = ['Video', 'All Video'];
    addCdsObject(obj, createContainerChain(chain));

    dir = getRootPath('object_root_path', obj.location);

    if (dir.length > 0) {
        chain = ['Video', 'Directories'];
        chain = chain.concat(dir);

        addCdsObject(obj, createContainerChain(chain));
    }
}

function addImage(obj) {

    var chain, date, dateParts, year, month, dir;
    
    chain = ['Photos', 'All Photos'];
    addCdsObject(obj, createContainerChain(chain), 'UPNP_CLASS_CONTAINER');

    date = obj.meta['M_DATE'];
    if (date) {
        dateParts = date.split('-');
        if (dateParts.length > 1) {
            year = dateParts[0];
            month = dateParts[1];

            chain = ['Photos', 'Year', year, month];
            addCdsObject(obj, createContainerChain(chain), 'UPNP_CLASS_CONTAINER');
        }

        chain = ['Photos', 'Date', date];
        addCdsObject(obj, createContainerChain(chain), 'UPNP_CLASS_CONTAINER');
    }

    dir = getRootPath('object_root_path', obj.location);

    if (dir.length > 0) {
        chain = ['Photos', 'Directories'];
        chain = chain.concat(dir);

        addCdsObject(obj, createContainerChain(chain));
    }
}


// main script part

if (getPlaylistType(orig.mimetype) === '') {
    var arr, mime, obj;
    
    arr = orig.mimetype.split('/');
    mime = arr[0];
    
    obj = orig; 
    obj.refID = orig.id;
    
    if (mime === 'audio') {
        addAudio(obj);
    }
    
    if (mime === 'video') {
        addVideo(obj);
    }
    
    if (mime === 'image') {
        addImage(obj);
    }

    if (orig.mimetype === 'application/ogg') {
        if (orig.theora === 1) {
            addVideo(obj);
        } else {
            addAudio(obj);
        }
    }
}
