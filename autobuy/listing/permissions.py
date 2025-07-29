from rest_framework import permissions
from rest_framework.permissions import BasePermission

class IsModerator(permissions.BasePermission):
    """
    Дозволяє доступ лише користувачам, які входять до групи 'moderators'.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.groups.filter(name='moderators').exists()

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.groups.filter(name="moderators").exists()

class IsModerator(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.groups.filter(name="moderators").exists()