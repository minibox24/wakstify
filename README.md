엄

# object

## Track

```json
{
  "id": "NzQyMDg2MDoxOjA",
  "date": "22.08.28",
  "start": 0,
  "end": 218,
  "cover": "비챤",
  "artist": "DEAN",
  "title": "instagram",
  "youtube": "lq3NLUN8DDc",
  "tags": [
    "VIi틀즈"
  ]
},
```

# route

## `GET` /tracks

```json
[
  <Track>
]
```

## `GET` /tracks/<id>

```json
{
  "track": <Track>,
  "source": {
    "url": (naver hls video url),
    "key": (naver hls video key)
  }
}
```
