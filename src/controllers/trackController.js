const Track = require('../models/Track');
const fs = require('fs');
const path = require('path');


exports.createTrack = async (req, res) => {
  try {
    const track = await Track.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { track }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};


exports.getAllTracks = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

   
    if (req.query.tags) {
      queryObj.tags = { $in: req.query.tags.split(',') };
    }


    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    
    const tracks = await Track.find(JSON.parse(queryStr));


    if (req.headers.accept && req.headers.accept.includes('text/html')) {
      const html = `
        <!DOCTYPE html>
        <html lang="uk">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Music Cards</title>
            <style>
                @keyframes cardAppear {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }

                body { 
                    font-family: 'Segoe UI', system-ui, sans-serif; 
                    background-color: #fcfaf9; 
                    color: #555; 
                    margin: 0; 
                    padding: 50px 20px;
                }

                .container {
                    max-width: 1000px;
                    margin: 0 auto;
                }

                h1 { 
                    font-weight: 300; 
                    text-align: center; 
                    margin-bottom: 50px; 
                    color: #444;
                    font-size: 2.2rem;
                }

                .grid { 
                    display: grid; 
                    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); 
                    gap: 25px; 
                }

                .card { 
                    background: white; 
                    border-radius: 24px; 
                    padding: 24px; 
                    box-shadow: 0 4px 15px rgba(0,0,0,0.02);
                    border: 1px solid rgba(0,0,0,0.03);
                    animation: cardAppear 0.5s ease-out forwards;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }

                .card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 12px 30px rgba(0,0,0,0.06);
                }

              
                .card:nth-child(4n+1) { border-top: 6px solid #e2ece9; }
                .card:nth-child(4n+2) { border-top: 6px solid #f0e4e4; } 
                .card:nth-child(4n+3) { border-top: 6px solid #e4e9f0; }
                .card:nth-child(4n+4) { border-top: 6px solid #f0eee4; } 

                .title { font-size: 1.25rem; font-weight: 600; color: #333; margin-bottom: 8px; }
                .artist { font-size: 0.95rem; color: #888; margin-bottom: 15px; }
                
                .footer {
                    margin-top: auto;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                }

                .tag { 
                    font-size: 0.7rem; 
                    padding: 5px 12px; 
                    border-radius: 12px;
                    background: #f5f5f5;
                    color: #777;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                
                ${[...Array(20)].map((_, i) => `.card:nth-child(${i+1}) { animation-delay: ${i * 0.1}s; }`).join('\n')}

                .no-data { grid-column: 1/-1; text-align: center; color: #bbb; padding: 100px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🎵 Музична Колекція</h1>
                <div class="grid">
                    ${tracks.length > 0 ? tracks.map(track => `
                        <div class="card">
                            <div>
                                <div class="title">${track.title}</div>
                                <div class="artist">${track.artist}</div>
                                <div style="font-size: 0.85rem; color: #aaa;">${track.album || ''}</div>
                            </div>
                            <div class="footer">
                                ${track.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                            </div>
                        </div>
                    `).join('') : '<div class="no-data">Тут поки нічого немає...</div>'}
                </div>
            </div>
        </body>
        </html>
      `;
      return res.send(html);
    }


    res.status(200).json({
      status: 'success',
      results: tracks.length,
      data: { tracks }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message
    });
  }
};


exports.getTrack = async (req, res) => {
  try {
    const track = await Track.findById(req.params.id);
    if (!track) {
      return res.status(404).json({ message: 'Трек не знайдено' });
    }
    res.status(200).json({
      status: 'success',
      data: { track }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message
    });
  }
};


exports.updateTrack = async (req, res) => {
  try {
    const track = await Track.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!track) {
      return res.status(404).json({ message: 'Трек не знайдено' });
    }
    res.status(200).json({
      status: 'success',
      data: { track }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};


exports.deleteTrack = async (req, res) => {
  try {
    const track = await Track.findByIdAndDelete(req.params.id);
    if (!track) {
      return res.status(404).json({ message: 'Трек не знайдено' });
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message
    });
  }
};


exports.exportTracks = async (req, res) => {
  try {
    const tracks = await Track.find();
    const exportPath = path.join(__dirname, '../../exports/tracks_export.json');
    
    const exportsDir = path.join(__dirname, '../../exports');
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir);
    }

    fs.writeFileSync(exportPath, JSON.stringify(tracks, null, 2));

    res.download(exportPath, 'tracks.json');
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Помилка при експорті: ' + err.message
    });
  }
};
