"""Optional artwork source. Run with Pillow to regenerate static assets; never needed for a website build."""
from pathlib import Path
from math import sin, cos
from PIL import Image, ImageDraw, ImageFont, ImageOps

out = Path('public/images/projects')
out.mkdir(parents=True, exist_ok=True)

def svg(name, accent, drawing):
    content = f'''<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="580" viewBox="0 0 1000 580">
    <defs><radialGradient id="bg"><stop stop-color="{accent}" stop-opacity=".26"/><stop offset="1" stop-color="#101019"/></radialGradient><linearGradient id="stroke" x1="0" x2="1" y2="1"><stop stop-color="{accent}"/><stop offset="1" stop-color="#ffffff" stop-opacity=".05"/></linearGradient><linearGradient id="panel" x2="1" y2="1"><stop stop-color="#242032"/><stop offset="1" stop-color="#111019"/></linearGradient><filter id="glow"><feGaussianBlur stdDeviation="7"/></filter><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#aaa0c9" stroke-opacity=".055"/></pattern></defs>
    <rect width="1000" height="580" fill="#101019"/><rect width="1000" height="580" fill="url(#bg)"/><rect width="1000" height="580" fill="url(#grid)"/>
    <circle cx="500" cy="290" r="228" fill="none" stroke="{accent}" stroke-opacity=".10"/><circle cx="500" cy="290" r="190" fill="none" stroke="{accent}" stroke-opacity=".06"/>
    {drawing}<path d="M60 70h18m-9-9v18M910 490h18m-9-9v18" stroke="{accent}" stroke-opacity=".5" stroke-width="1"/></svg>'''
    (out/name).write_text(content, encoding='utf-8')

nodes = ''.join(f'<circle cx="{500+cos(i*1.3)*210}" cy="{290+sin(i*1.3)*150}" r="4" fill="#bba2ec"/><path d="M{500+cos(i*1.3)*210} {290+sin(i*1.3)*150}L500 290" stroke="#a78bfa" stroke-opacity=".18"/>' for i in range(10))
svg('medai.svg', '#8b5cf6', f'''{nodes}<g transform="translate(500 290) rotate(-12)"><rect x="-126" y="-126" width="252" height="252" rx="53" fill="url(#panel)" stroke="url(#stroke)"/><rect x="-110" y="-110" width="220" height="220" rx="42" fill="none" stroke="#bca0fa" stroke-opacity=".08"/><path d="M-80 12h36l24-65 36 110 25-65h40" fill="none" stroke="#a78bfa" stroke-width="13" opacity=".3" filter="url(#glow)"/><path d="M-80 12h36l24-65 36 110 25-65h40" fill="none" stroke="#c2a7f3" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/></g>''')
paths = ''.join(f'<path d="M-50 {140+i*38} C250 {80+i*23},290 {530-i*20},510 {310+i*18} S850 {30+i*20},1080 {180+i*30}" fill="none" stroke="{["#8b5cf6","#8a8bd9","#c0a2f0"][i%3]}" stroke-opacity="{.22+i*.05}" stroke-width="{1.4 if i%2 else 2}"/>' for i in range(7))
svg('mediflow.svg', '#5659a6', f'''{paths}<g transform="translate(510 290) rotate(-10)"><rect x="-75" y="-75" width="150" height="150" rx="38" fill="url(#panel)" stroke="#b4a8e3" stroke-opacity=".7"/><path d="M-33-28v56m0-28h66m0-28v56" stroke="#b5a3ee" stroke-width="5" stroke-linecap="round"/><circle cx="-33" cy="-28" r="6" fill="#b5a3ee"/><circle cx="33" cy="28" r="6" fill="#b5a3ee"/></g>''')
bars = ''.join(f'<rect x="{190+i*15}" y="{290-(h:=20+abs(sin(i*.64))*130*(1-abs(i-20)/30))}" width="5" height="{h*2}" rx="2.5" fill="#c39bdd" opacity="{.3+sin(i*.2)**2*.6}"/>' for i in range(42))
svg('voice.svg','#965ba5',bars)
dots = ''.join(f'<circle cx="{200+i*20}" cy="{440-i*10+sin(i*4)*45}" r="{4+(i%3)}" fill="#a296dc" opacity="{.4+(i%4)/8}"/>' for i in range(31))
svg('car.svg','#5d699f',f'<path d="M180 115v340h640" fill="none" stroke="#b5b2d8" stroke-opacity=".3"/>{dots}<path d="M210 420C370 350 530 250 800 140" stroke="#c5b0ec" stroke-width="3" fill="none"/>')
rects = ''.join(f'<rect x="{260+i*85}" y="{420-h}" width="45" height="{h}" rx="5" fill="#b8759b" opacity="{.35+i*.1}"/>' for i,h in enumerate([110,180,145,245,210,290]))
svg('netflix.svg','#7e3859',f'<path d="M210 140v300h570" fill="none" stroke="#c893af" stroke-opacity=".15"/>{rects}')

image = Image.new('RGB',(1200,630),'#08080d'); draw=ImageDraw.Draw(image)
font_path='C:/Windows/Fonts/segoeui.ttf'; bold_path='C:/Windows/Fonts/segoeuib.ttf'
font=lambda size,bold=False:ImageFont.truetype(bold_path if bold else font_path,size)
draw.rectangle((0,0,1199,629),outline='#292330',width=2)
draw.text((72,62),'CURIOSITY  /  CODE  /  IMPACT',font=font(19),fill='#a78bfa')
draw.text((70,150),'Hussein',font=font(86,True),fill='#f5f5f7')
draw.text((70,246),'Zahran.',font=font(86,True),fill='#b19bd9')
draw.text((74,382),'AI Student & Python Developer',font=font(27),fill='#c4c0cd')
draw.text((74,432),'Intelligence, engineered with purpose.',font=font(22),fill='#96919f')
portrait=ImageOps.fit(Image.open('public/images/profile/hussein-zahran.jpeg').convert('RGB'),(330,390),centering=(0.5,0.45))
image.paste(portrait,(800,119)); draw.line((72,555,1128,555),fill='#282230',width=1)
draw.text((74,576),'AMMAN, JORDAN',font=font(16),fill='#a1a1aa')
image.save('public/images/og-cover.png',optimize=True)
