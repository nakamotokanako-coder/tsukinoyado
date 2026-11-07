# シェア用画像（OG）を作る：python3 tools/og.py
import json,os
from PIL import Image,ImageDraw,ImageFont,ImageFilter
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A=R+'/src/assets/'
SERIF='/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc'
SANS='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
def F(p,s,i=0): return ImageFont.truetype(p,s,index=i)
BG=(250,242,232);INK=(43,36,64);MUT=(122,110,140);ACC=(196,120,40)
ORDER=['mani','moti','prava','panna','pushpa','hira','nila','gome','duri']
PL={'太陽':'mani','月':'moti','火星':'prava','水星':'panna','木星':'pushpa','金星':'hira','土星':'nila','ラーフ':'gome','ケートゥ':'duri'}
NM={'mani':('マニ','ルビー'),'moti':('モティ','真珠'),'prava':('プラヴァ','赤珊瑚'),'panna':('パンナ','エメラルド'),'pushpa':('プシュパ','イエローサファイア'),'hira':('ヒーラ','ダイヤモンド'),'nila':('ニーラ','ブルーサファイア'),'gome':('ゴメ','ヘソナイト'),'duri':('ドゥーリ','キャッツアイ')}
def sp(id,size):
    im=Image.open(A+'seirei/'+id+'.webp').convert('RGBA');return im.resize((size,size),Image.LANCZOS)
def shadow(base,im,xy):
    w,h=im.size;bb=im.getchannel('A').getbbox();sh=Image.new('RGBA',(w+80,90),(0,0,0,0));dd=ImageDraw.Draw(sh)
    bw=(bb[2]-bb[0])*0.8;dd.ellipse(((w+80)/2-bw/2,30,(w+80)/2+bw/2,60),fill=(90,60,30,70));sh=sh.filter(ImageFilter.GaussianBlur(10))
    base.alpha_composite(sh,(xy[0]-40,xy[1]+bb[3]-45));base.alpha_composite(im,xy)
def bg():
    im=Image.new('RGBA',(1200,630),BG+(255,));d=ImageDraw.Draw(im)
    for r in range(520,0,-8):
        c=tuple(int(BG[k]+(255-BG[k])*(1-r/520)*0.5) for k in range(3));d.ellipse((600-r*1.4,315-r,600+r*1.4,315+r),fill=c+(255,))
    return im
def center(d,y,t,f,fill):
    w=d.textlength(t,font=f);d.text(((1200-w)/2,y),t,font=f,fill=fill)
# 全体
im=bg();d=ImageDraw.Draw(im)
lg=Image.open(A+'logo.webp').convert('RGBA').resize((96,96),Image.LANCZOS);im.alpha_composite(lg,(552,14))
center(d,112,'インド占星術',F(SERIF,30),MUT)
center(d,146,'ナヴァラトナ',F(SERIF,80),INK)
center(d,250,'9つの宝石の精と読む、無料占い ─ 27星宿・星図・相性・吉日',F(SANS,26),MUT)
S=140;x0=(1200-(S-12)*8-S)//2
for i,k in enumerate(ORDER):
    shadow(im,sp(k,S),(x0+i*(S-12),330+(0 if i%2==0 else 30)))
center(d,588,'tsukinoyado.vercel.app',F(SANS,20),MUT)
im.convert('RGB').save(A+'og.png',optimize=True)
# 星宿ごと
nak=json.load(open(R+'/content/nak_data.json'))
for n in nak:
    id=PL[n['lord']];im=bg();d=ImageDraw.Draw(im)
    shadow(im,sp(id,440),(700,110))
    lg=Image.open(A+'logo.webp').convert('RGBA').resize((56,56),Image.LANCZOS);im.alpha_composite(lg,(80,46))
    d.text((80,110),'インド占星術の27星宿',font=F(SANS,26),fill=MUT)
    nm=n['name'];fs=96 if len(nm)<=6 else 76 if len(nm)<=9 else 60
    d.text((76,150),nm,font=F(SERIF,fs),fill=INK)
    d.text((80,300),f"{n['lord']}が守る星宿",font=F(SANS,30),fill=INK)
    a,g=NM[id];d.text((80,350),f"宝石の精　{a}（{g}）",font=F(SERIF,36),fill=ACC)
    d.text((80,405),"ナヴァラトナ　9つの宝石の精より",font=F(SANS,24),fill=MUT)
    d.text((80,520),'インド占星術ナヴァラトナ　tsukinoyado.vercel.app',font=F(SANS,24),fill=MUT)
    im.convert('RGB').save(A+'og/nak-'+n['slug']+'.jpg',quality=88,optimize=True)
print('ok',len(nak))
