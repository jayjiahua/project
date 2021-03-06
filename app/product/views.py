# -*- coding: utf-8 -*-
from flask import request, g, abort, render_template
from . import productbp
from .models import Product
from .forms import CatxPageForm
from .. import db
from ..util.common import jsonError, jsonResponse, viaMobile     
from ..util.errno import ProductErrno
from ..user.utils import buyer_login_required 
from ..category.models import Cat1, Cat2
from ..category.utils import _get_catx

@productbp.route('/list', methods=['GET', ])
@buyer_login_required(False, 'main.index')
def get_product_list_by_catx_render():
    return 'GET'
    u = g.buyer
    bd = u.building
    cat1_id = request.args.get('cat1', type=int)
    cat2_id = request.args.get('cat2', type=int)
    try:
        pds, current_cat1 = _get_product_list(bd, cat1_id, cat2_id)
    except:
        abort(404)
    return render_template('', user=u, catx=_get_catx(), current_cat1=current_cat1, products=pds)

# ajax
@productbp.route('/list', methods=['POST', ])
@buyer_login_required(True)
def get_product_list_by_catx_ajax():
    return 'POST'
    u = g.buyer
    bd = u.building
    form = CatxPageForm()
    if form.validate_on_submit():
        cat1_id = form.cat1_id.data or None
        cat2_id = form.cat2_id.data or None
        try:
            pds, current_cat1 = _get_product_list(bd, cat1_id, cat2_id)
        except:
            return jsonError(ProductErrno.CATX_DOES_NOT_EXIST)
        products = []
        for i in pds:
            data = dict()
            pd = i[0]
            pd_bd = i[1]
            data['id'] = pd.id
            data['name'] = pd.name
            data['description'] = pd.description
            data['filename'] = pd.pic.filename
            data['price'] = pd.price
            data['quantity'] = pd_bd.quantity
            data['sold_cnt'] = pd_bd.sold_cnt_rd
            products.append(data)
        return jsonResponse({
            'products': products,
            'current_cat1': {
                current_cat1.id,
                current_cat1.name,
                },
            })
    return jsonError(ProductErrno.INVALID_ARGUMENT)

def _get_product_list(building, cat1_id=None, cat2_id=None, page=None, per_page=12):
    '''
    get product list in current location, filter by catx, order by quantity and sold count
    '''
    baseq = db.session.query(Product, Product_building).\
            join(Product_building, Product_building.product_id==Poduct.id).\
            filter(Product_building.building_id==bd.id)
    cat1, cat2 = None, None
    if cat1_id and not cat2_id: # filter by cat1
        cat1 = Cat1.query.get(cat1_id)
        if not cat1:
            raise Exception('Cat1 does not exist.')
        subq = baseq.join(Cat2, Product.cat2_id==Cat2.id).\
                join(Cat1, Cat2.cat1_id==Cat1.id).\
                filter(Cat1.id==cat1.id)
    elif cat2_id: # filter by cat2
        cat2 = Cat2.query.get(cat2_id) 
        if not cat2:
            raise Exception('Cat2 does not exist.')
        cat1 = cat2.cat1
        subq = baseq.join(Cat2, Product.cat2_id==Cat2.id).\
                filter(Cat2.id==cat2.id)
    else:
        # not filter by category
        subq = baseq
    # sort
    sq = subq.order_by(db.case([(Product_building.quantity!=0, Product_building.sold_cnt_rd), ], else_=-1).desc())
    # paginate
    if page is not None:
        pq = sq.paginate(page, per_page=per_page, error_out=False)
        return pq, current_cat1 # pagination obj
    else:
        pds = sq.all()
        return pds, current_cat1

