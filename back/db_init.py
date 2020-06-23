# -*- coding: utf-8 -*-  
from server import db
from config import OPERATORNAME, OPERATORPSWD, SECRETKEY
import model, random
from model import *
import random

images = ['https://img.alicdn.com/imgextra/i2/47774461/O1CN01j5B6CQ1ipBSOlC9xL_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/129857660/O1CN01FKeosW26SKT6tefqk_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/464260164/O1CN0158fJU61D59YkFShZc_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/361500001/O1CN01t4iwoM1BsV0203bF3_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/109824586/TB2OgEhXyoaPuJjSsplXXbg7XXa_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/113567753/O1CN01XhAHKP278vF5cXyD7_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/1112220063/O1CN01sQ7ObD1CKtY2fOstn_!!2-saturn_solar.png','https://img.alicdn.com/imgextra/i2/707780100/O1CN01dCxbkL1CbqDMrDEbF_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/68874052/O1CN01yDpEG11fnrSuYe8mY_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/68874052/O1CN01uNb0tp1fnrSycEB7M_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/766270174/O1CN01CVCyuh1D9jWAMmFI0_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/546870019/O1CN01AvfQAj1C0k8H7Yj16_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/19095562/O1CN01Cg7weI1qxRVsFj7iG_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/132740378/O1CN01sTRhgQ1EfAJnjS8my_!!2-saturn_solar.png','https://img.alicdn.com/imgextra/i1/1251570109/O1CN01b1ma851CfxmJNLIwm_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/128206664/O1CN01Ct1Qch1z69zQ4gRF3_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/1122750011/O1CN01b9amIM1Bx4xqEFdFK_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i4/1102910086/O1CN01L1AnvP1CVQfOP5eQf_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i4/124230282/O1CN019ANIhx1DxCIYXXMOa_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/35786088/O1CN016EumCx1uqLprSi22K_!!2-saturn_solar.png','https://img.alicdn.com/imgextra/i2/115999303/O1CN01AgKIn02IapCeHdisH_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i4/27012134/O1CN01PHz9vW1RdPoEEkeiB_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/476230025/O1CN01HmyXze1C3UVFpDUgo_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/1017170077/O1CN01TvaCVy1CRJ6VP1rlg_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/15789191/O1CN01o9Q17r2HlWp64SK8T_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i4/55985182/O1CN01fIChfO1o9P1JQ7Nv5_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/113550920/O1CN01tLrCCJ1IfOuTXNkCw_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/23806266/O1CN017jwT291w9sLLjV2cG_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/33025798/O1CN013GGnOu1shWzp04N06_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/109824586/TB2HXJ0XqigSKJjSsppXXabnpXa_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/360390016/O1CN012dXOc21BzMwLG4HFQ_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i4/126686473/O1CN01DKHVxK1xggL9GGPzu_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/297010096/O1CN01vZaPlt1Ca0aTlnJcc_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/189170200/O1CN01twHP6e1DLdon3Ccds_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/1158980016/O1CN01ihTGuG1BzMwDASW2t_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i4/495480150/O1CN014rJ4Px1Cyk0uLp1cg_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/845530150/O1CN01Z0st7z1Cyk0wi1sqb_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/129392096/O1CN01tSNIKO1RM0kUKX81h_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/391530075/O1CN01BMW21H1CQOJRliMTT_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/926790012/O1CN01XUsnfc1BxXMKvbKi0_!!2-saturn_solar.png','https://img.alicdn.com/imgextra/i4/114181848/O1CN01Y7azQF1PWQWoe1hZQ_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/526360092/O1CN01ED32ZW1CYB0e9bkJm_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i4/55985182/O1CN01GABTw21o9P1L8KTcr_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/906230096/O1CN01YDa3y61Ca0d24vlIk_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/100253524/O1CN01q0pBCC1bu2LE4Q8mi_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/1059480097/O1CN01Ep1vES1CaT1SuMRFO_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/391190160/O1CN019xbA4O1D3JxUDARvX_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/1217030036/O1CN01Gjc7EP1C8WrfSvGZJ_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/13375080/O1CN01bVZpLa1nOgcOAB71r_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/391190160/O1CN0195zSKW1D3JxURRDgL_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/47224492/O1CN01vmcG9a1j3NjevXCAx_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/31524539/O1CN011iYOEP1jOuLPNPf6V_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/116870022/O1CN01mIoiLk1C27HT58olL_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/1006250103/O1CN011iuRk81CdDOXhWF2O_!!2-saturn_solar.png','https://img.alicdn.com/imgextra/i1/124870861/O1CN01383Vq21IENcVDkKTI_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/124870861/O1CN01q77bjV1IENcSlmavp_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/130054579/O1CN01na5xKY1jhEBlP1bBx_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i4/458440017/O1CN01RuQafG1BzpLCJKjbI_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/707780100/O1CN01aw25MI1CbqDMrUp1v_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i4/16174393/O1CN01chWlyY1iK2VA58DRl_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/637000030/O1CN01V9ytDC1C5mT3t1UDi_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/1217030036/O1CN018vDKL51C8WriMnPYT_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/360390016/O1CN01X9Os8X1BzMwYu2CwY_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/1017170077/O1CN01c33tMo1CRJ6P78Pe3_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/56482591/O1CN01cgMFQL1V0iiXUryHn_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/132740378/O1CN01gw4wno1EfAJpH5rEx_!!2-saturn_solar.png','https://img.alicdn.com/imgextra/i1/122269752/O1CN01Ny5BJD2LuT2O9XBke_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i4/128817676/O1CN01wmHMEp26Zefmv5YRW_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/124960421/O1CN01CVtBvy1EyrLmxdO31_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/1083240060/O1CN010sChX81CJWN1WyzfH_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/35362416/O1CNA1GRO17Q100da4e1699b0b153b6e000x_!!1-0-picassodesign.jpg','https://img.alicdn.com/imgextra/i3/32813783/O1CN01EMWrFo1doevBAB8FU_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/889140102/O1CN016PQwDr1Ccl07W9AiO_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/687760094/O1CN016y1yTh1CZ5oi6eSW6_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/32572062/O1CN014RkFJa1R6RH7jUSzz_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/121703079/O1CN015njgq31YcE44Ls7Xg_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/249120085/O1CN01hoxgZC1CUyBU4V2DH_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/132361051/O1CN01O95aN41JdOrJGEQUl_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/1071580178/O1CN01PVFHCU1DBZ6fqwB7X_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i4/1235210067/O1CN011SYEVm1CMj8nRSwvL_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/110545114/O1CN01YNKBXH1neG4YPVngu_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/123289203/O1CN01pJBpDZ2Hr1b95UADT_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/23806266/O1CN014nJQat1w9sLM08pnr_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/127581280/O1CN01hHXC2o1LKHZT0hZFK_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/129467693/O1CN014mY0GA26hRXSoTjUd_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/854200128/O1CN011wRwla1CofHVtn4SU_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/16180661/O1CN01JjyZZy1GkmIekGzRA_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/131926583/O1CN01NeFzfD1yV3t2eXSrK_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i4/127675334/O1CN01q15h7B1pH1CzkuMOL_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i4/13375080/O1CN01DiOOij1nOgcLGErUM_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/114783524/O1CN01kA7tUi1bu2LBF0wXK_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/47224492/O1CN01MLtU4i1j3NjWt3xsK_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/118577926/O1CN01rrSytW28Q9pA7b44M_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/476230025/O1CN01NzCqnK1C3UVWjfClK_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/100429704/TB2WOcuncuYBuNkSmRyXXcA3pXa_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i4/1006250103/O1CN01yDu6B31CdDOVbJS1V_!!2-saturn_solar.png','https://img.alicdn.com/imgextra/i3/882330165/O1CN019Vqf5m1D5bxIyn6KA_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i4/48653430/O1CN01M3x1OW1bCz72jnQ08_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/110372989/O1CN015eYP2b1Xx0RfIRSxJ_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/26929937/O1CN01owwZ0F2NHCJOiNznt_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/129857660/O1CN01FKeosW26SKT6tefqk_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/464260164/O1CN0158fJU61D59YkFShZc_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/361500001/O1CN01t4iwoM1BsV0203bF3_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/109824586/TB2OgEhXyoaPuJjSsplXXbg7XXa_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/113567753/O1CN01XhAHKP278vF5cXyD7_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/1112220063/O1CN01sQ7ObD1CKtY2fOstn_!!2-saturn_solar.png','https://img.alicdn.com/imgextra/i2/707780100/O1CN01dCxbkL1CbqDMrDEbF_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/68874052/O1CN01yDpEG11fnrSuYe8mY_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/68874052/O1CN01uNb0tp1fnrSycEB7M_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/766270174/O1CN01CVCyuh1D9jWAMmFI0_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/546870019/O1CN01AvfQAj1C0k8H7Yj16_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/19095562/O1CN01Cg7weI1qxRVsFj7iG_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/132740378/O1CN01sTRhgQ1EfAJnjS8my_!!2-saturn_solar.png','https://img.alicdn.com/imgextra/i1/1251570109/O1CN01b1ma851CfxmJNLIwm_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/128206664/O1CN01Ct1Qch1z69zQ4gRF3_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/1122750011/O1CN01b9amIM1Bx4xqEFdFK_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i4/1102910086/O1CN01L1AnvP1CVQfOP5eQf_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i4/124230282/O1CN019ANIhx1DxCIYXXMOa_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/35786088/O1CN016EumCx1uqLprSi22K_!!2-saturn_solar.png','https://img.alicdn.com/imgextra/i2/115999303/O1CN01AgKIn02IapCeHdisH_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i4/27012134/O1CN01PHz9vW1RdPoEEkeiB_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/476230025/O1CN01HmyXze1C3UVFpDUgo_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/15789191/O1CN01o9Q17r2HlWp64SK8T_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i4/55985182/O1CN01fIChfO1o9P1JQ7Nv5_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/113550920/O1CN01tLrCCJ1IfOuTXNkCw_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/23806266/O1CN017jwT291w9sLLjV2cG_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/33025798/O1CN013GGnOu1shWzp04N06_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/109824586/TB2HXJ0XqigSKJjSsppXXabnpXa_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/360390016/O1CN012dXOc21BzMwLG4HFQ_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i4/126686473/O1CN01DKHVxK1xggL9GGPzu_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/297010096/O1CN01vZaPlt1Ca0aTlnJcc_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/189170200/O1CN01twHP6e1DLdon3Ccds_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/1158980016/O1CN01ihTGuG1BzMwDASW2t_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i4/495480150/O1CN014rJ4Px1Cyk0uLp1cg_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/845530150/O1CN01Z0st7z1Cyk0wi1sqb_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/129392096/O1CN01tSNIKO1RM0kUKX81h_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/391530075/O1CN01BMW21H1CQOJRliMTT_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/926790012/O1CN01XUsnfc1BxXMKvbKi0_!!2-saturn_solar.png','https://img.alicdn.com/imgextra/i4/114181848/O1CN01Y7azQF1PWQWoe1hZQ_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/526360092/O1CN01ED32ZW1CYB0e9bkJm_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i4/55985182/O1CN01GABTw21o9P1L8KTcr_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/906230096/O1CN01YDa3y61Ca0d24vlIk_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/100253524/O1CN01q0pBCC1bu2LE4Q8mi_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/391190160/O1CN019xbA4O1D3JxUDARvX_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/1217030036/O1CN01Gjc7EP1C8WrfSvGZJ_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/13375080/O1CN01bVZpLa1nOgcOAB71r_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/126638616/O1CN01oNWXtH2DWB5iCVhXk_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/391190160/O1CN0195zSKW1D3JxURRDgL_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/47224492/O1CN01vmcG9a1j3NjevXCAx_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/31524539/O1CN011iYOEP1jOuLPNPf6V_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/116870022/O1CN01mIoiLk1C27HT58olL_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/1006250103/O1CN011iuRk81CdDOXhWF2O_!!2-saturn_solar.png','https://img.alicdn.com/imgextra/i1/124870861/O1CN01383Vq21IENcVDkKTI_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/124870861/O1CN01q77bjV1IENcSlmavp_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/130054579/O1CN01na5xKY1jhEBlP1bBx_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i4/458440017/O1CN01RuQafG1BzpLCJKjbI_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/707780100/O1CN01aw25MI1CbqDMrUp1v_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i4/16174393/O1CN01chWlyY1iK2VA58DRl_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/637000030/O1CN01V9ytDC1C5mT3t1UDi_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/1217030036/O1CN018vDKL51C8WriMnPYT_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/360390016/O1CN01X9Os8X1BzMwYu2CwY_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/56482591/O1CN01cgMFQL1V0iiXUryHn_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/132740378/O1CN01gw4wno1EfAJpH5rEx_!!2-saturn_solar.png','https://img.alicdn.com/imgextra/i1/122269752/O1CN01Ny5BJD2LuT2O9XBke_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i4/128817676/O1CN01wmHMEp26Zefmv5YRW_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/124960421/O1CN01CVtBvy1EyrLmxdO31_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/35362416/O1CNA1GRO17Q100da4e1699b0b153b6e000x_!!1-0-picassodesign.jpg','https://img.alicdn.com/imgextra/i3/32813783/O1CN01EMWrFo1doevBAB8FU_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/889140102/O1CN016PQwDr1Ccl07W9AiO_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/687760094/O1CN016y1yTh1CZ5oi6eSW6_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/32572062/O1CN014RkFJa1R6RH7jUSzz_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/121703079/O1CN015njgq31YcE44Ls7Xg_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/249120085/O1CN01hoxgZC1CUyBU4V2DH_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/132361051/O1CN01O95aN41JdOrJGEQUl_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/1071580178/O1CN01PVFHCU1DBZ6fqwB7X_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i4/1235210067/O1CN011SYEVm1CMj8nRSwvL_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/110545114/O1CN01YNKBXH1neG4YPVngu_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/123289203/O1CN01pJBpDZ2Hr1b95UADT_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/23806266/O1CN014nJQat1w9sLM08pnr_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/127581280/O1CN01hHXC2o1LKHZT0hZFK_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/129467693/O1CN014mY0GA26hRXSoTjUd_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/854200128/O1CN011wRwla1CofHVtn4SU_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/16180661/O1CN01JjyZZy1GkmIekGzRA_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/131926583/O1CN01NeFzfD1yV3t2eXSrK_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i4/127675334/O1CN01q15h7B1pH1CzkuMOL_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i4/13375080/O1CN01DiOOij1nOgcLGErUM_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/114783524/O1CN01kA7tUi1bu2LBF0wXK_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/47224492/O1CN01MLtU4i1j3NjWt3xsK_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/118577926/O1CN01rrSytW28Q9pA7b44M_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/476230025/O1CN01NzCqnK1C3UVWjfClK_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/100429704/TB2WOcuncuYBuNkSmRyXXcA3pXa_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i4/1006250103/O1CN01yDu6B31CdDOVbJS1V_!!2-saturn_solar.png','https://img.alicdn.com/imgextra/i3/882330165/O1CN019Vqf5m1D5bxIyn6KA_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i4/48653430/O1CN01M3x1OW1bCz72jnQ08_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/110372989/O1CN015eYP2b1Xx0RfIRSxJ_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/26929937/O1CN01owwZ0F2NHCJOiNznt_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/897440177/O1CN018vSQz11DB6i8lr0M4_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i2/125743093/O1CN01cOI7Pc1YiddURV4cJ_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i3/331080014/O1CN01FPiySY1ByS8JItfOC_!!0-saturn_solar.jpg','https://img.alicdn.com/imgextra/i1/29904580/O1CN01c8iPFU1jhgaIfgors_!!0-saturn_solar.jpg']

def add_initial_accounts():
    db.session.add(User('SYSTEM').setPassword(SECRETKEY).setVisible(False))
    db.session.add(User(OPERATORNAME).setPassword(OPERATORPSWD).setVisible(False))

    user = User('manager').setPassword('12345678')
    user.isManager = True
    db.session.add(user)

    user = User('operator').setPassword('12345678')
    user.isOperator = True
    db.session.add(user)

    user = User('supplier').setPassword('12345678')
    user.isSupplier = True
    db.session.add(user)

    user = User('marketing').setPassword('12345678')
    user.isMarketing = True
    db.session.add(user)

    db.session.commit()
    words = '0123456789'
    for word in words:
        name = 'User'+word
        db.session.add(User(name).setPassword('12345678'))
        db.session.commit()

def add_storehouse():
    words = ['黄浦区','徐汇区','长宁区','静安区','普陀区','虹口区','杨浦区','浦东新区','闵行区','奉贤区']
    for word in words:
        name = word+' 仓库'
        address = 'address_'+word
        phone = 'phone_'+word
        db.session.add(Storehouse(name,address,phone,3,4))
        db.session.commit()

def add_catagories():
    icons = {
        '时令水果': ['https://img.alicdn.com/imgextra/i3/3311258085/O1CN01ED9ti829aymWupbml_!!3311258085-0-lubanu-s.jpg_60x60q90.jpg','https://img.alicdn.com/imgextra/i3/2206419295411/O1CN01iMr6CF1pqHiLoUgtt_!!2206419295411.jpg_60x60q90.jpg','https://img.alicdn.com/imgextra/i2/2206687576330/O1CN01dgas7N1wdBf9skzwP_!!2206687576330.jpg_60x60q90.jpg','https://img.alicdn.com/imgextra/i2/3012860579/O1CN01NwsQ101G9DvbFSAYo_!!3012860579.jpg_60x60q90.jpg'],
        '蔬菜菌菇': ['https://img.alicdn.com/imgextra/i4/2627785630/O1CN01IIzE011rSaSOLdxZY_!!2627785630-0-lubanu-s.jpg_60x60q90.jpg','https://gd3.alicdn.com/imgextra/i3/3651988214/O1CN01E7wF2o2AY3s0X0qqu_!!3651988214.jpg_50x50.jpg_.webp','https://img.alicdn.com/imgextra/i3/2200831675730/O1CN01ADwEr71sCO1SSaCuz_!!2200831675730.jpg_60x60q90.jpg','https://img.alicdn.com/imgextra/https://img.alicdn.com/imgextra/i4/2081100909/O1CN01D7cSD71IaMbclQmip_!!2081100909.jpg_60x60q90.jpg'],
        '肉蛋水产': ['https://img.alicdn.com/imgextra/i4/3299989615/TB2HBORtRsmBKNjSZFsXXaXSVXa_!!3299989615.jpg_60x60q90.jpg','https://img.alicdn.com/imgextra/https://img.alicdn.com/imgextra/i1/3032983070/O1CN01q9XDTz1YY6WcMpB0g_!!3032983070.jpg_60x60q90.jpg','https://img.alicdn.com/imgextra/i4/2201440705187/O1CN01VAD24i1oBgzON6mbG_!!2201440705187.jpg_60x60q90.jpg','https://img.alicdn.com/imgextra/i1/3410332553/O1CN012hwfaB1UjJkFIyM2m_!!3410332553.jpg_60x60q90.jpg'],
        '乳品烘焙': ['https://img.alicdn.com/imgextra/i1/2836984312/O1CN01znPSZu1hiwPhnfIVr_!!2836984312.jpg_60x60q90.jpg','https://img.alicdn.com/imgextra/i2/2200763402684/O1CN01YRxzz41VhJcJBfc6E_!!2200763402684.jpg_60x60q90.jpg','https://img.alicdn.com/imgextra/https://img.alicdn.com/imgextra/i2/4084273869/O1CN011aNSO51eS2tNWtKJy_!!4084273869.jpg_60x60q90.jpg','https://img.alicdn.com/imgextra/i3/3087622110/O1CN01pw4MEl1RSQF3j8gHI_!!3087622110.jpg_60x60q90.jpg']
    }
    catagories = {
        '时令水果': ['瓜类', '柑橘柚橙', '浆果莓类', '热带水果'],
        '蔬菜菌菇': ['特色鲜蔬', '豆类', '叶菜', '南北干货'],
        '肉蛋水产': ['猪肉', '牛肉', '禽肉', '蛋类'], 
        '乳品烘焙': ['西式面包', '冰激凌', '乳酸饮料', '冷藏鲜奶'],
    }
    for k, v in catagories.items():
        cate = Category(k, None, icons[k][0])
        db.session.add(cate)
        db.session.commit()
        for idx, subitem in enumerate(v):
            db.session.add(Category(subitem, cate.id, icons[k][idx]))
            db.session.commit()

import random
words = 'ABCDEFGHIJKLMNOPQRSTUVWXYZαβγδεζνξοπρσηθικλμτυφχψω'
def add_products():
    cates = Category.all()
    stors = Storehouse.all()
    for stor in stors:
        stor_id = Storehouse.query.filter_by(name=stor).first().id
        for k, v in cates.items():
            for subc in v:
                for i in range(5):
                    cate_id = Category.query.filter_by(name=subc).first().id
                    title = '商品 ' + random.sample(words, 1)[0]
                    prod = Product(title, cate_id, stor_id)
                    datadict = {
                        'thumbnail': random.sample(images, 1)[0],
                        'htmlDescription': random.sample(images, 1)[0],
                        'remain': random.randint(2, 233),
                        'price': random.uniform(0.01, 100.00),
                        'unit': '个',
                        'shelved': True,
                        'archived': False,
                    }
                    prod.update(datadict)
                    db.session.add(prod)
                    db.session.commit()

def init_database():
    add_initial_accounts()
    add_storehouse()
    add_catagories()
    add_products()
    add_order()
    add_supplierOrder()

def add_order():
    for num in range(0,10):
        creator_id=random.randint(5,14)
        storehouse_id=random.randint(1,2)
        order=Order(creator_id)
        db.session.add(order)
        db.session.commit()
        for num1 in range(0,5):
            subord=Order(creator_id)
            product_id=random.randint(1,800)
            product = Product.query.filter_by(id=product_id).first()
            subord.fill(product_id,random.randint(1,10),product.price,order.id)
            db.session.add(subord)
            db.session.commit()

    for num in range(0,10):
        creator_id=random.randint(5,14)
        storehouse_id=random.randint(1,2)
        order=Order(creator_id)
        order.paid=True
        db.session.add(order)
        db.session.commit()
        for num1 in range(0,5):
            subord=Order(creator_id)
            product_id=random.randint(1,800)
            product = Product.query.filter_by(id=product_id).first()
            subord.fill(product_id,random.randint(1,10),product.price,order.id)
            db.session.add(subord)
            db.session.commit()

    for num in range(0,10):
        creator_id=random.randint(5,14)
        storehouse_id=random.randint(1,2)
        order=Order(creator_id)
        order.paid=True
        order.accepted=True
        db.session.add(order)
        db.session.commit()
        for num1 in range(0,5):
            subord=Order(creator_id)
            product_id=random.randint(1,800)
            product = Product.query.filter_by(id=product_id).first()
            subord.fill(product_id,random.randint(1,10),product.price,order.id)
            db.session.add(subord)
            db.session.commit()

    for num in range(0,10):
        creator_id=random.randint(5,14)
        storehouse_id=random.randint(1,2)
        order=Order(creator_id)
        order.paid=True
        order.accepted=True
        order.delivered=True
        db.session.add(order)
        db.session.commit()
        for num1 in range(0,5):
            subord=Order(creator_id)
            product_id=random.randint(1,800)
            product = Product.query.filter_by(id=product_id).first()
            subord.fill(product_id,random.randint(1,10),product.price,order.id)
            db.session.add(subord)
            db.session.commit()

    for num in range(0,10):
        creator_id=random.randint(5,14)
        storehouse_id=random.randint(1,2)
        order=Order(creator_id)
        order.paid=True
        order.accepted=True
        order.delivered=True
        order.archived=True
        db.session.add(order)
        db.session.commit()
        for num1 in range(0,5):
            subord=Order(creator_id)
            product_id=random.randint(1,800)
            product = Product.query.filter_by(id=product_id).first()
            subord.fill(product_id,random.randint(1,10),product.price,order.id)
            db.session.add(subord)
            db.session.commit()

    for num in range(0,10):
        creator_id=random.randint(5,14)
        storehouse_id=random.randint(1,2)
        order=Order(creator_id)
        order.cancelled=True
        db.session.add(order)
        db.session.commit()
        for num1 in range(0,5):
            subord=Order(creator_id)
            product_id=random.randint(1,800)
            product = Product.query.filter_by(id=product_id).first()
            subord.fill(product_id,random.randint(1,10),product.price,order.id)
            db.session.add(subord)
            db.session.commit()

def add_supplierOrder():
    for num in range(0,10):
        sup=SupplierOrder(3)
        storehouse_id=random.randint(1,2)
        sup.fill(random.randint(1,800),storehouse_id,random.randint(100,1000))
        db.session.add(sup)
        db.session.commit()

    for num in range(0,10):
        sup=SupplierOrder(3)
        storehouse_id=random.randint(1,2)
        sup.fill(random.randint(1,800),storehouse_id,random.randint(100,1000))
        sup.confirmed = True
        db.session.add(sup)
        db.session.commit()

    for num in range(0,10):
        sup=SupplierOrder(3)
        storehouse_id=random.randint(1,2)
        sup.fill(random.randint(1,800),storehouse_id,random.randint(100,1000))
        sup.rejected = True
        sup.rejectReason = "something so bad"
        db.session.add(sup)
        db.session.commit()

    for num in range(0,10):
        sup=SupplierOrder(3)
        storehouse_id=random.randint(1,2)
        sup.fill(random.randint(1,800),storehouse_id,random.randint(100,1000))
        sup.accepted=True
        db.session.add(sup)
        db.session.commit()

    for num in range(0,10):
        sup=SupplierOrder(3)
        storehouse_id=random.randint(1,2)
        sup.fill(random.randint(1,800),storehouse_id,random.randint(100,1000))
        sup.delivered=True
        db.session.add(sup)
        db.session.commit()    
'''
    for num in range(0,10):
        sup=SupplierOrder(3)
        storehouse_id=random.randint(1,2)
        sup.fill(random.randint(1,800),storehouse_id,random.randint(100,1000))
        sup.paid=True
        sup.accepted=True
        sup.delivered=True
        sup.confirmed=True
        db.session.add(sup)
        db.session.commit()    

    for num in range(0,10):
        sup=SupplierOrder(3)
        storehouse_id=random.randint(1,2)
        sup.fill(random.randint(1,800),storehouse_id,random.randint(100,1000))
        sup.paid=True
        sup.accepted=True
        sup.delivered=True
        sup.rejected=True
        db.session.add(sup)
        db.session.commit()    
    
    for num in range(0,10):
        sup=SupplierOrder(3)
        storehouse_id=random.randint(1,2)
        sup.fill(random.randint(1,800),storehouse_id,random.randint(100,1000))
        sup.cancelled=True
        db.session.add(sup)
        db.session.commit()    
'''
if __name__ == '__main__':
    #add_supplierOrder()
    #add_storehouse()
    #add_catagories()
    #add_initial_accounts()
    #add_products()
    #init_database()
    add_order()
    # add_products()
    # create_catagories()
    # print(Category.all())
    # print(Category.query.filter_by(title="乳品烘焙").first().children())
    # create_initial_accounts()
    
    #add_test_storehouse()
    # add_test_product()
    
    # add_order()
    # add_supplierOrder()