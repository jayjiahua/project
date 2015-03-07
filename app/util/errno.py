# -*- coding: utf-8 -*-

# global errno
class Errno(object):
    INVALID_ARGUMENT = (1, 'Invalid arguments.')
    CSRF_FAILED = (2, 'Csrf token check failed.')
    USER_OFFLINE = (3, 'User should choose location to init account.')

# custom errno
class UserErrno(Errno):
    BUILDING_DOES_NOT_EXIST = (-1, 'Building does not exist.')
    LOCATION_INFO_DOES_NOT_EXIST = (-2, 'Location info does not exist.')
    CONTACT_INFO_DOES_NOT_EXIST = (-3, 'Contact info does not exist.')

class AdminErrno(Errno):
    pass

class FileErrno(Errno):
    pass

class CartErrno(Errno):
    MUST_CLEAR_CART = (-1, 'Your cart has products not in your current location. Should Clear first.')
    CART_INVALID = (-2, 'Product does not exist or quantity is 0.')
    CART_DOES_NOT_EXIST = (-3, 'Cart record does not exist.')

class ProductErrno(Errno):
    pass

class LocationErrno(Errno):
    SCHOOL_DOES_NOT_EXIST = (-1, 'School does not exist.')

class OrderErrno(Errno):
    PRODUCT_REFRESH = (-1, 'Some product info has been updated, please reload.')
    CART_INVALID = (-2, 'Some item in cart is invalid, please reload.')

class CategoryErrno(Errno):
    pass

