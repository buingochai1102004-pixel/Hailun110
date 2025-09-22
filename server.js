const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

const keys = { "DEMO-KEY-1234": { active: true, expires: "2099-01-01" } };

const remoteLuaScript = `--REMOTE-SCRIPT
gg.toast("Remote script chạy: key hợp lệ")
local x,y = 500, 800
local delay = 150
local ok = gg.alert("Remote script đã được kích hoạt!\nOK để bắt đầu, Cancel để thoát")
if ok == 1 then
  while true do
    os.execute("input tap " .. x .. " " .. y)
    gg.sleep(delay)
  end
end
`;

app.post('/validate', (req, res) => {
  const key = req.body && req.body.key;
  if (!key) return res.status(400).json({ ok: false, err: 'missing key' });

  const info = keys[key];
  if (!info || !info.active) return res.status(401).json({ ok: false, err: 'invalid key' });

  if (new Date(info.expires) < new Date()) {
    return res.status(403).json({ ok: false, err: 'expired' });
  }

  res.set('Content-Type', 'text/plain; charset=utf-8');
  return res.status(200).send(remoteLuaScript);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
